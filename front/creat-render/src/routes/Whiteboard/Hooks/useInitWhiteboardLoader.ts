import creatLoader from '@uiuing/creat-loader'
import { Node } from '@uiuing/creat-loader/types'
import { create, diff } from 'jsondiffpatch'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import { getWhiteboardLocalData } from '../../../utils/data'
import { creatLoaderOKState } from '../store'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'

export function useInitWhiteboardLoader() {
  const [localData, setLocalData] = useRecoilState<any>(
    GetLocalDataStateObject()
  )

  const [creatOK, setCreatOK] = useState(false)
  const [isLoaderOK, setIsLoaderOK] = useState(false)

  const [creatLoaderOK, setCreatLoaderOK] = useRecoilState(creatLoaderOKState)

  useEffect(() => {
    // 初始化白板数据
    getWhiteboardLocalData(window.whiteboardId).then((data) => {
      if (creatLoaderOK) {
        setLocalData(whiteboardApp().getData())
        const { state } = whiteboardApp().getData()
        whiteboardApp()?.setData(
          {
            state: {
              ...state,
              defaultColor: localData?.state?.defaultColor
                ? localData?.state?.defaultColor
                : '#000000'
            },
            nodes: data && 'nodes' in data ? data.nodes : localData.nodes
          },
          true,
          true
        )
        setCreatOK(true)
      }
    })
  }, [creatLoaderOK])

  // 之所以白板的渲染和事件分开，是因为白板的渲染需要等待loader的初始化完成
  useLayoutEffect(() => {
    window.whiteboard = creatLoader({
      plotType: 'selection',
      defaultColor: '#000000'
    }).mount('#creat-loader')
    setCreatLoaderOK(true)
  }, [])

  useEffect(() => {
    let tmp = localData
    whiteboardApp()?.watch.localDataChange((data) => {
      if (isLoaderOK) {
        const nodesDelta = create({
          objectHash(obj: Node) {
            return obj.id
          },
          arrays: {
            detectMove: false
          }
        }).diff(tmp.nodes, data.nodes)
        const stateDelta = diff(tmp.state, data.state)
        if (nodesDelta) {
          PubSub.publish('diff-nodes', nodesDelta)
        }
        if (stateDelta && window.readonly) {
          PubSub.publish('diff-state', stateDelta)
        }
        tmp = data
        setLocalData(data)
      }
    })
    setIsLoaderOK(true)
  }, [creatOK])

  return isLoaderOK
}
