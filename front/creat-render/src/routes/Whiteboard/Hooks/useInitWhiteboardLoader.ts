import creatLoader from '@uiuing/creat-loader'
import { diff } from 'jsondiffpatch'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { getUserTmpInfo } from '../../../utils/data'
import {
  cloudWhiteboardState,
  creatLoaderOKState,
  userTmpInfoState
} from '../store'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'

export function useInitWhiteboardLoader() {
  const [localData, setLocalData] = useRecoilState<any>(
    GetLocalDataStateObject()
  )

  const [isLoaderOK, setIsLoaderOK] = useState(false)

  const [userTmpInfo, setUserTmpInfo] = useRecoilState(userTmpInfoState)

  const cloudWhiteboard = useRecoilValue(cloudWhiteboardState)

  const setCreatLoaderOK = useSetRecoilState(creatLoaderOKState)

  async function init() {
    window.whiteboard = creatLoader({
      plotType: 'selection',
      defaultColor: '#000000'
    }).mount('#creat-loader')

    // 初始化颜色
    let { color } = userTmpInfo
    if (!color || !cloudWhiteboard.isAuthor) {
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

    // 监听白板数据变化, 这是一个事件，当前不会操作
    let tmp: any = {}
    whiteboardApp()?.watch.localDataChange((data) => {
      if (window.isCloud) {
        const nodesDelta = diff(tmp.nodes, data.nodes)
        const stateDelta = diff(tmp.state, data.state)
        if (nodesDelta) {
          PubSub.publish('diff-nodes', nodesDelta)
        }
        if (stateDelta && window.readonly) {
          PubSub.publish('diff-state', stateDelta)
        }
      }
      tmp = data
      setLocalData(data)
    })

    window.onceLoader = true

    // 初始化白板数据变化
    const hasNodes = localData.nodes.length !== 0
    const hasState = Object.keys(localData.state).length !== 0
    if (hasNodes && hasState) {
      tmp = localData
      whiteboardApp().setData(localData, true, true)
    } else if ((hasNodes && !hasState) || (!hasNodes && hasState)) {
      tmp = localData
      whiteboardApp().setData(
        {
          nodes: localData.nodes,
          state: { ...whiteboardApp().getData().state, defaultColor: color }
        },
        true,
        true
      )
    } else {
      const nowData = whiteboardApp().getData()
      tmp = nowData
      setIsLoaderOK(true)
    }
    setIsLoaderOK(true)
    setCreatLoaderOK(true)
  }

  useEffect(() => {
    if (localData && 'nodes' in localData && !window.onceLoader) {
      init().then(() => {})
    }
  }, [localData])

  return isLoaderOK
}
