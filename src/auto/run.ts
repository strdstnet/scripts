import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://github.com/pmmp/BedrockData/raw/master'

const GBS = path.join(__dirname, '..', 'generate-block-states')
const GRM = path.join(__dirname, '..', 'generate-runtime-map')

async function downloadFile(fileName: string, to: string) {
  const data = await fetch(`${BASE_URL}/${fileName}`).then(res => res.buffer())

  const toPath = path.join(to, fileName)
  if(fs.existsSync(toPath)) {
    console.log(toPath, 'exists, deleting...')
    fs.unlinkSync(toPath)
  }

  fs.writeFileSync(toPath, data)
}

function clean() {
  const dirs = [
    [__dirname, 'block_mapping.json'],
    [__dirname, 'item_mapping.json'],

    [GBS, 'r12_to_current_block_map.bin'],
    [GBS, 'canonical_block_states.nbt'],
    [GBS, 'block_id_map.json'],
    [GBS, 'block_states.json'],

    [GRM, 'block_states.json'],
    [GRM, 'item_id_map.json'],
    [GRM, 'r16_to_current_item_map.json'],
    // [GRM, 'items.json'],
    [GRM, 'block_mapping.json'],
    [GRM, 'item_mapping.json'],
  ]

  for(const parts of dirs) {
    const dir = path.join(...parts)

    if(fs.existsSync(dir)) fs.unlinkSync(dir)
  }
}

function moveFile(from: string, to: string) {
  const data = fs.readFileSync(from)

  fs.writeFileSync(to, data)

  fs.unlinkSync(from)
}

async function genBlockStates() {
  await downloadFile('r12_to_current_block_map.bin', GBS)
  await downloadFile('canonical_block_states.nbt', GBS)
  await downloadFile('block_id_map.json', GBS)

  await import('../generate-block-states/run')
}

async function genRuntimeMap() {
  const fileName = 'block_states.json'
  moveFile(path.join(GBS, fileName), path.join(GRM, fileName))

  await downloadFile('item_id_map.json', GRM)
  await downloadFile('r16_to_current_item_map.json', GRM)

  await import('../generate-runtime-map/run')

  moveFile(path.join(GRM, 'block_mapping.json'), path.join(__dirname, 'block_mapping.json'))
  moveFile(path.join(GRM, 'item_mapping.json'), path.join(__dirname, 'item_mapping.json'))
}

;(async() => {
  clean()

  await genBlockStates()
  await genRuntimeMap()
})()
