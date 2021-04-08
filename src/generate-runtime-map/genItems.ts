import fs from 'fs'
import path from 'path'

export interface IItemMap {
  toRuntime: {
    [k: string]: number,
  },
  toNamespaced: string[],
}

interface IItem {
  name: string,
  id: number,
}

export function genItemMap(): IItemMap {
  const toolTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'tools.json')).toString())
  const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'item_id_map.json')).toString())
  const itemMap: IItemMap = {
    toRuntime: {},
    toNamespaced: [],
  }

  const tools = toolTypes.reduce((p: any, c: any) => [...p, ...c.items], [] as IItem[])
  const allItems = [...tools, ...Object.entries(items).map(([k, v]) => ({ name: k, id: v }))]

  for(const { name: nid, id: rid } of allItems) {
    itemMap.toRuntime[nid] = rid
    itemMap.toNamespaced[rid] = nid
  }

  return itemMap
}