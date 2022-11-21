import { patch } from 'jsondiffpatch'
import PubSub from 'pubsub-js'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { io } from 'socket.io-client'

import { wssApiBaseUrl } from '../apis/common'
import { cloudWhiteboardState, creatLoaderOKState } from '../store'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'

export default function useSyncWatch() {
  const creatLoaderOK = useRecoilValue(creatLoaderOKState)

  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)

  const setLocalData = useSetRecoilState<any>(GetLocalDataStateObject())

  // WebSocket 事件
  function watch() {
    const socket = io(wssApiBaseUrl)

    // 加入房间
    socket.emit('join', window.whiteboardId)

    // 接收 Diff Nodes 数据
    socket.on('diff-nodes', (nodesDelta) => {
      const nowData = whiteboardApp()?.getData()
      const newNodes = patch(
        JSON.parse(JSON.stringify(nowData.nodes)),
        nodesDelta
      )
      // 去除重复id，采用最新的
      const newNodesMap = new Map()
      newNodes.forEach((item: any) => {
        newNodesMap.set(item.id, item)
      })
      const newNodesArr: any[] = []
      newNodesMap.forEach((item) => {
        newNodesArr.push(item)
      })
      whiteboardApp()?.setData(
        {
          state: nowData.state,
          nodes: newNodesArr
        },
        true,
        true
      )
      setLocalData(newNodesArr)
    })

    // 接收 Diff State 数据
    socket.on('diff-state', (stateDelta) => {
      const nowData = whiteboardApp()?.getData()
      whiteboardApp()?.setData(
        {
          state: patch(nowData.state, stateDelta),
          nodes: nowData.nodes
        },
        true,
        true
      )
      setLocalData(whiteboardApp().getData())
    })

    // 接收白板名称、只读状态
    socket.on('update-info', (info) => {
      setCloudWhiteboard({
        ...cloudWhiteboard,
        ...info
      })
      // console.log(info)
    })

    // 发送 Diff Nodes 数据
    PubSub.subscribe('diff-nodes', (msg, nodesDelta) => {
      socket.emit('diff-nodes', nodesDelta)
    })

    // 发送 Diff State 数据
    PubSub.subscribe('diff-state', (msg, stateDelta) => {
      socket.emit('diff-state', stateDelta)
    })

    // 发送更新白板名称、只读状态
    PubSub.subscribe('update-info', (msg, info) => {
      socket.emit('update-info', info)
    })
  }

  useEffect(() => {
    if (creatLoaderOK && whiteboardApp() && cloudWhiteboard.isCloud) {
      watch()
    }
  }, [creatLoaderOK, cloudWhiteboard.isCloud])
}
