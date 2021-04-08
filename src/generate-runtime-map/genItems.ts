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

function getR16Items() {
  const itemsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'item_id_map.json')).toString())
  const r16Translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'r16_to_current_item_map.json')).toString())

  const newObj: any = {}
  let i = 0
  for(const [nid] of Object.entries(itemsJson)) {
    if(r16Translations.simple[nid]) {
      newObj[r16Translations.simple[nid]] = i

      i++
    } else if(r16Translations.complex[nid]) {
      for(const [, newNid] of Object.entries(r16Translations.complex[nid]) as any[]) {
        newObj[newNid || nid] = i

        i++
      }
    } else {
      newObj[nid] = i

      i++
    }
  }

  return newObj
}

export function genItemMap(): IItemMap {
  const toolTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'tools.json')).toString())
  const itemMap: IItemMap = {
    toRuntime: {},
    toNamespaced: [],
  }

  const itemsObj = getR16Items()
  const items = Object.entries(itemsObj).map(([nid, id]) => ({ nid, id }))
  const tools: any[] = toolTypes.reduce((p: any, c: any) => [...p, ...c.items], [] as IItem[])
    .map((tool: any) => ({ ...tool, id: itemsObj[tool.nid] }))
  const allItems = [...tools, ...(items.filter(item => tools.findIndex(t => t.id === item.id) === -1))]
    .sort((a, b) => a.id - b.id)

  for(let i = 1; i < allItems.length; i++) {
    const { nid, id } = allItems[i]

    let rid = id

    if(nid === 'minecraft:air') rid = 0
    else rid = i

    itemMap.toRuntime[nid] = rid
    itemMap.toNamespaced[rid] = nid
  }

  return {
    toRuntime: Object.entries(itemMap.toRuntime)
      .sort(([,a],[,b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}),
    toNamespaced: itemMap.toNamespaced,
  }
}