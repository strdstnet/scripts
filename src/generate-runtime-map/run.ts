import fs from 'fs'
import path from 'path'
import { genBlockMap } from './genBlocks'
import { genItemMap } from './genItems'

fs.writeFileSync(path.join(__dirname, 'block_mapping.json'), JSON.stringify(genBlockMap(), null, 2))
fs.writeFileSync(path.join(__dirname, 'item_mapping.json'), JSON.stringify(genItemMap(), null, 2))
