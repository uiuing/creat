import creatLoader from '@uiuing/creat-loader'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { creatLoaderOKState } from '../store'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'
import { checkHasDiff, parseDiffNodes, parseDiffState } from '../utils/diffData'

export function useInitWhiteboardLoader() {
  const [localData, setLocalData] = useRecoilState<any>(
    GetLocalDataStateObject()
  )

  const [creatOK, setCreatOK] = useState(false)
  const [isLoaderOK, setIsLoaderOK] = useState(false)

  const [creatLoaderOK, setCreatLoaderOK] = useRecoilState(creatLoaderOKState)

  useEffect(() => {
    // 初始化白板数据
    if (creatLoaderOK && 'state' in localData) {
      const nowData = whiteboardApp()?.getData()
      whiteboardApp().setData(
        {
          state: { ...nowData.state, ...localData.state },
          nodes: localData.nodes
        },
        true,
        true
      )
    }
    setCreatOK(true)
  }, [creatLoaderOK, localData])

  // 之所以白板的渲染和事件分开，是因为白板的渲染需要等待loader的初始化完成
  useLayoutEffect(() => {
    window.whiteboard = creatLoader({
      plotType: 'selection',
      defaultColor: '#000000'
    }).mount('#creat-loader')
    setCreatLoaderOK(true)
  }, [])

  useEffect(() => {
    if ('state' in localData && creatOK) {
      let tmp = localData
      // 监听白板数据变化
      if (isLoaderOK) {
        whiteboardApp()?.watch.localDataChange((data) => {
          // Diff 数据
          if (checkHasDiff(tmp.nodes, data.nodes)) {
            const diffNodesRes = parseDiffNodes(tmp.nodes, data.nodes)
            if (diffNodesRes) {
              PubSub.publish('diff-nodes', diffNodesRes)
            }
          }
          if (checkHasDiff(tmp.state, data.state)) {
            const diffStateRes = parseDiffState(tmp.state, data.state)
            if (diffStateRes) {
              PubSub.publish('diff-state', diffStateRes)
            }
          }
          tmp = data
          setLocalData(data)
        })
      }
    }
    setIsLoaderOK(true)
  }, [creatOK, localData])

  return isLoaderOK
}
