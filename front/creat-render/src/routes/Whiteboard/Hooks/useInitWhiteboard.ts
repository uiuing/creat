import { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import {
  getWhiteboardInfoById,
  getWhiteboardLocalData
} from '../../../utils/data'
import { checkWhiteboardShare } from '../apis/prepare'
import {
  cloudLocalDataState,
  cloudWhiteboardState,
  localDataState
} from '../store'

export default function useInitWhiteboard() {
  const [checkOK, setCheckOK] = useState(false)
  const [hasWhiteboardId, setHasWhiteboardId] = useState(false)

  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)

  const setLocalData = useSetRecoilState(localDataState)

  const setCloudLocalData = useSetRecoilState(cloudLocalDataState)

  async function init() {
    // 判断是否为原作者
    const whiteboardInfo = await getWhiteboardInfoById(window.whiteboardId)
    const hasWhiteboardInfo = !!whiteboardInfo

    // 判断是否已分享
    checkWhiteboardShare(window.whiteboardId, async ({ status, data }) => {
      if (status === 200) {
        setCloudWhiteboard({
          isCloud: true,
          isAuthor: hasWhiteboardInfo,
          readonly: (data?.info as any).readonly,
          name: (data?.info as any).name
        })
        const nowData = {
          state: {},
          nodes: data?.nodes
        }
        if (hasWhiteboardInfo) {
          setLocalData(nowData)
        } else {
          setCloudLocalData(nowData as any)
        }

        setHasWhiteboardId(true)
        // 是作者，没共享 ｜ 无网络
      } else if (hasWhiteboardInfo) {
        const r = await getWhiteboardInfoById(window.whiteboardId)
        setCloudWhiteboard({
          ...cloudWhiteboard,
          name: r?.name as any,
          isAuthor: hasWhiteboardInfo
        })
        const localLocalData = await getWhiteboardLocalData(window.whiteboardId)
        if (
          !localLocalData ||
          (Array.isArray(localLocalData) && localLocalData.length === 0)
        ) {
          setLocalData({
            state: {},
            nodes: []
          })
        } else {
          setLocalData(localLocalData as any)
        }
        setHasWhiteboardId(true)
      }
      setCheckOK(true)
    })
  }

  useLayoutEffect(() => {
    init().then(() => {})
  }, [])

  // 留个标记，避免diff不必要的触发
  useEffect(() => {
    window.isCloud = cloudWhiteboard.isCloud
    window.readonly = cloudWhiteboard.readonly
  }, [cloudWhiteboard])

  return [checkOK, hasWhiteboardId]
}
