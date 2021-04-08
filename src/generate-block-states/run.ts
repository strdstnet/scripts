import fs from 'fs'
import path from 'path'
import { BinaryData } from '@strdstnet/utils.binary'
import { CompoundTag, IntTag, StringTag } from '@strdst/utils.nbt'

interface IBlockState {
  name: string,
  id: number,
  meta: number,
  runtimeId: number,
  states: any,
}

interface IKnownState {
  name: string,
  states: CompoundTag,
  runtimeId: number,
}

interface IConversionState {
  name: string,
  meta: number,
  states: CompoundTag,
}

type IPMMPState = {
  name: StringTag,
  states: CompoundTag,
  version: IntTag,
}

const blockIds = JSON.parse(fs.readFileSync(path.join(__dirname, 'block_id_map.json')).toString())

const file = fs.readFileSync(path.join(__dirname, 'canonical_block_states.nbt'))
const data = new BinaryData(file)

const conversionFile = fs.readFileSync(path.join(__dirname, 'r12_to_current_block_map.bin'))
const conversionData = new BinaryData(conversionFile)

const states: IBlockState[] = []

const knownStates: IKnownState[] = []
const conversionStates: IConversionState[] = []

let runtimeId = 0
while(!data.feof) {
  const tag = data.readTag() as CompoundTag<IPMMPState>

  knownStates.push({
    name: tag.val('name'),
    states: tag.get('states'),
    runtimeId: runtimeId++,
  })
}

while(!conversionData.feof) {
  const name = conversionData.readString()

  conversionStates.push({
    name,
    meta: conversionData.readLShort(),
    states: conversionData.readTag<CompoundTag<IPMMPState>>().get('states'),
  })
}

loop: for(const conversionState of conversionStates) {
  const id = (blockIds as any)[conversionState.name]

  for(const knownState of knownStates) {
    if(conversionState.name === knownState.name && conversionState.states.equals(knownState.states)) {
      states.push({
        name: conversionState.name,
        id,
        meta: conversionState.meta,
        runtimeId: knownState.runtimeId,
        states: knownState.states.value,
      })
      continue loop
    }
  }
}


console.log(states)
fs.writeFileSync(path.join(__dirname, 'block_states.json'), JSON.stringify(states, null, 2))
