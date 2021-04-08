import map from './map.json'
import fs from 'fs'
import path from 'path'

const toNamespaced = []
for(const [nid, rid] of Object.entries(map)) {
  toNamespaced[rid] = nid
}


fs.writeFileSync(path.join(__dirname, 'item_mapping.json'), JSON.stringify({
  toRuntime: map,
  toNamespaced,
}, null, 2))
