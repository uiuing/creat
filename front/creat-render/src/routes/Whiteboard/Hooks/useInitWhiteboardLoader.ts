import creatLoader from '@uiuing/creat-loader'
import { diff } from 'jsondiffpatch'
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
    if ('state' in localData && creatOK && !window.onceLoader) {
      let tmp = localData
      // 监听白板数据变化
      if (isLoaderOK) {
        whiteboardApp()?.watch.localDataChange((data) => {
          const nodesDelta = diff(tmp.nodes, data.nodes)
          const stateDelta = diff(tmp.state, data.state)
          if (nodesDelta) {
            PubSub.publish('diff-nodes', nodesDelta)
          }
          if (stateDelta && window.readonly) {
            PubSub.publish('diff-state', stateDelta)
          }
          tmp = data
          setLocalData(data)
          window.onceLoader = true
        })
      }
    }
    setIsLoaderOK(true)
  }, [creatOK, localData])

  return isLoaderOK
}
