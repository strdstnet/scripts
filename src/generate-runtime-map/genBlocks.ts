import fs from 'fs'
import path from 'path'

export interface IBlockMap {
  toRuntime: {
    [k: string]: number[], // List of `rid`s. Index is meta
  },
  toNamespaced: Array<{
    nid: string,
    meta: number,
  }>,
  // id: {
  //   to: { [k: string]: number },
  //   from: number[],
  // },
}

export function genBlockMap(): IBlockMap {
  const states = JSON.parse(fs.readFileSync(path.join(__dirname, 'block_states.json')).toString())
  const blockMap: IBlockMap = {
    toRuntime: {},
    toNamespaced: [],
    // id: {
    //   to: {},
    //   from: [],
    // },
  }

  for(const { name: nid, runtimeId: rid, meta, id } of states) {
    if(!blockMap.toRuntime[nid]) blockMap.toRuntime[nid] = []

    if(!rid) {
      console.log({ nid, rid, meta })
    }

    blockMap.toRuntime[nid].push(rid)
    blockMap.toNamespaced[rid] = { nid, meta }

    // if(typeof blockMap.id.to[nid] === 'undefined') {
    //   blockMap.id.to[nid] = id
    //   blockMap.id.from[id] = nid
    // }
  }

  return blockMap
}