import { useState } from 'react'

import { getWhiteboardInfos } from '../../../utils/data'

export function useWhiteboardId() {
  const id = window.location.pathname.replaceAll('/', '')
  const [hasId, setHasId] = useState(false)
  const [checkOK, setCheckOK] = useState(false)

  // TODO : 检查云上是否存在该白板
  // ....

  parseHasWhiteBoardId(id).then((res) => {
    setHasId(res)
    setCheckOK(true)
  })

  return [hasId, checkOK]
}

async function parseHasWhiteBoardId(id: string) {
  const infos = await getWhiteboardInfos()
  for (const info of infos) {
    if (info.id === id) {
      window.whiteboardId = id
      return true
    }
  }
  return false
}
