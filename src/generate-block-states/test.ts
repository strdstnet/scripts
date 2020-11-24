import fs from 'fs'
import path from 'path'
import { BinaryData } from '@strdstnet/utils.binary'
import { CompoundTag, IntTag, StringTag } from '@strdst/utils.nbt'
import blockIds from './block_id_map.json'

const file = fs.readFileSync(path.join(__dirname, 'r12_to_current_block_map.bin'))
const data = new BinaryData(file)

const file2 = fs.readFileSync(path.join(__dirname, 'block_states.nbt'))
const data2 = new BinaryData(file2)

console.log({
  name: data.readString(),
  meta: data.readLShort(),
  state: data.readTag(),
})

const tag = data2.readTag() as CompoundTag

const name = tag.val('name')
console.log({
  name,
  id: (blockIds as any)[name],
  meta: 0,
  runtimeId: 0,
  states: tag.val('states'),
})
