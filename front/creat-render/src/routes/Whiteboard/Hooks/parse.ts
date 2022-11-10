import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { getWhiteboardInfos } from '../../../utils/data'
import { cloudWhiteboardState } from '../store'
import { socketIsOKState } from '../store/cooperationReceive'
import { checkShare } from '../utils/sendMessage'

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
  const [needJoin, setNeedJoin] = useState(false)
  const socketIsOK = useRecoilValue(socketIsOKState)
  const setCloudWhiteboard = useSetRecoilState(cloudWhiteboardState)
  useEffect(() => {
    parseHasWhiteBoardId().then((has) => {
      if (has) {
        setHasId(true)
      }
      if (socketIsOK) {
        checkShare((data: any) => {
          if (!window.noOnceCheckShare) {
            if (data.status === 200) {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              // 加入房间的判断依据就是，setCloudWhiteboard.isCloud 云上存在
              setCloudWhiteboard({
                isCloud: true,
                isAuthor: has,
                name: data.whiteboard.name,
                readonly: data.whiteboard.readonly
              })
              window.isCloud = true
              setNeedJoin(true)
              setCheckOK(true)
            } else {
              setCheckOK(true)
            }
            window.noOnceCheckShare = true
          }
        })
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setCloudWhiteboard({
          isCloud: false,
          isAuthor: has,
          name: undefined,
          readonly: false
        })
        window.isCloud = false
        setCheckOK(true)
      }
    })
  }, [socketIsOK])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return [hasId, needJoin, checkOK]
}
