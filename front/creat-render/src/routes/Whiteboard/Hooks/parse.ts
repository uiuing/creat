import { useState } from 'react'

import { getWhiteboardInfos } from '../../../utils/data'

export function parseUrlWhiteboardId() {
  const id = window.location.pathname.replaceAll('/', '')
  window.whiteboardId = id
  return id
}

export function useWhiteboardId() {
  const id = window.whiteboardId
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
      return true
    }
  }
  return false
}
