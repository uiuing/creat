import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { getWhiteboardInfos } from '../../../utils/data'
import { cloudWhiteboardState } from '../store'
import { socketIsOKState } from '../store/cooperationReceive'
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
  const socketIsOK = useRecoilValue(socketIsOKState)
  const setCloudWhiteboard = useSetRecoilState(cloudWhiteboardState)
  useEffect(() => {
    parseHasWhiteBoardId().then((has) => {
      if (has) {
        setHasId(true)
      }
      if (socketIsOK) {
        checkShare((data) => {
          if (data.code === 200) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            setCloudWhiteboard({
              isCloud: true,
              isAuthor: hasId,
              name: data.whiteboard.name,
              readonly: data.whiteboard.readonly
            })
            setCheckOK(true)
          } else {
            setCheckOK(true)
          }
          window.rws?.close()
        })
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setCloudWhiteboard({
          isCloud: false,
          isAuthor: hasId,
          name: undefined,
          readonly: false
        })
        setCheckOK(true)
        window.rws?.close()
      }
    })
  }, [])
  return [hasId, checkOK]
}
