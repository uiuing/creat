import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { getWhiteboardInfos } from '../../../utils/data'
import { cloudWhiteboardState } from '../store'
import { checkShare } from '../utils/syncManage/send'

async function parseHasWhiteBoardId() {
  const infos = await getWhiteboardInfos()
  for (const info of infos) {
    if (info.id === window.whiteboardId) {
      return true
    }
  }
  return false
}

export function parseUrlWhiteboardId() {
  const id = window.location.pathname.replaceAll('/', '')
  window.whiteboardId = id
  return id
}

export function useWhiteboardId() {
  const [hasId, setHasId] = useState(false)
  const [checkOK, setCheckOK] = useState(false)
  useEffect(() => {
    parseHasWhiteBoardId().then((has) => {
      if (has) {
        setHasId(true)
        setCheckOK(true)
        window.rws?.close()
        return
      }
      checkShare((data) => {
        if (data.code === 200) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useSetRecoilState(cloudWhiteboardState)({
            is: true,
            name: data.whiteboard.name,
            readonly: data.whiteboard.readonly
          })
          setHasId(true)
          setCheckOK(true)
        } else {
          window.rws?.close()
          setCheckOK(true)
        }
      })
    })
  }, [])
  return [hasId, checkOK]
}
