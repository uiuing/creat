import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  getUserTmpInfo,
  getWhiteboardInfoById,
  setWhiteboardLocalData
} from '../../../utils/data'
import { checkWhiteboardShare } from '../apis/prepare'
import { cloudWhiteboardState, userTmpInfoState } from '../store'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'

export default function useInitWhiteboard() {
  const [checkOK, setCheckOK] = useState(false)
  const [hasWhiteboardId, setHasWhiteboardId] = useState(false)

  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)

  const setLocalData = useSetRecoilState(GetLocalDataStateObject())

  const [userTmpInfo, setUserTmpInfo] = useRecoilState(userTmpInfoState)

  async function init() {
    // 判断是否为原作者
    const whiteboardInfo = await getWhiteboardInfoById(window.whiteboardId)
    const hasWhiteboardInfo = !!whiteboardInfo
    setCloudWhiteboard({
      ...cloudWhiteboard,
      isAuthor: hasWhiteboardInfo
    })

    // 判断是否已分享
    checkWhiteboardShare(window.whiteboardId, async ({ status, data }) => {
      if (status === 200) {
        const state = whiteboardApp()?.getData().state
        let { color } = userTmpInfo
        if (!color || !hasWhiteboardInfo) {
          const res = await getUserTmpInfo()
          setUserTmpInfo(res)
          color = res.color
        } else {
          setUserTmpInfo({
            ...(await getUserTmpInfo()),
            color: '#000000'
          })
          color = '#000000'
        }
        if (hasWhiteboardInfo) {
          await setWhiteboardLocalData(
            {
              state: { ...state, defaultColor: color },
              nodes: data?.nodes as any
            },
            window.whiteboardId
          )
        }
        setLocalData({
          state: { ...state, defaultColor: color },
          nodes: data?.nodes
        })
        setCloudWhiteboard({
          isCloud: true,
          isAuthor: hasWhiteboardInfo,
          readonly: (data?.info as any).readonly,
          name: (data?.info as any).name
        })
        setHasWhiteboardId(true)
      }
      // 是作者，没共享 ｜ 无网络
      if (hasWhiteboardInfo) {
        setHasWhiteboardId(true)
      }
      setCheckOK(true)
    })
  }

  useEffect(() => {
    init()
  }, [])

  // 留个标记，避免diff不必要的触发
  useEffect(() => {
    window.isCloud = cloudWhiteboard.isCloud
    window.readonly = cloudWhiteboard.readonly
  }, [cloudWhiteboard])

  return [checkOK, hasWhiteboardId]
}
