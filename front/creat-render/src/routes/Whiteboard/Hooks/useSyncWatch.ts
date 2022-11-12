import { patch } from 'jsondiffpatch'
import PubSub from 'pubsub-js'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { io } from 'socket.io-client'

import { cloudWhiteboardState, creatLoaderOKState } from '../store'
import { GetLocalDataStateObject, removePromise, whiteboardApp } from '../utils'

export default function useSyncWatch() {
  const creatLoaderOK = useRecoilValue(creatLoaderOKState)
  const cloudWhiteboard = useRecoilValue(cloudWhiteboardState)
  const setLocalData = useSetRecoilState<any>(GetLocalDataStateObject())

  useEffect(() => {
    if (creatLoaderOK && whiteboardApp() && cloudWhiteboard.isCloud) {
      const socket = io(`ws://127.0.0.1:4911`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let user = {}
      socket.on('connect', () => {
        socket.on('user', (u) => {
          user = u
        })
      })

      socket.emit('join', window.whiteboardId)

      socket.on('diff-nodes', (nodesDelta) => {
        const nowData = whiteboardApp()?.getData()
        whiteboardApp()?.setData(
          {
            state: nowData.state,
            nodes: patch(removePromise(nowData.nodes), nodesDelta)
          },
          true,
          true
        )
        setLocalData(whiteboardApp().getData())
      })

      socket.on('diff-state', (stateDelta) => {
        const nowData = whiteboardApp()?.getData()
        whiteboardApp()?.setData(
          {
            state: removePromise(patch(nowData.state, stateDelta)),
            nodes: nowData.nodes
          },
          true,
          true
        )
        setLocalData(whiteboardApp().getData())
      })

      PubSub.subscribe('diff-nodes', (msg, nodesDelta) => {
        socket.emit('diff-nodes', nodesDelta)
      })

      PubSub.subscribe('diff-state', (msg, stateDelta) => {
        socket.emit('diff-state', stateDelta)
      })

      // Diff 数据发生
      // whiteboardApp()?.watch.diffNodesChange((diffNodes) => {
      //   console.log('diffNodes', diffNodes)
      // if (
      //   window.isCloud &&
      //   (cloudWhiteboard.isAuthor || !cloudWhiteboard.readonly)
      // ) {
      //   socket.emit('diff', diffNodes)
      // }
      // })

      // 只读的时候同步 scale ScrollX ScrollY
      // whiteboardApp()?.watch.diffStateChange((state) => {
      //   if (window.isCloud) {
      //     // syncState(state)
      //   }
      // })
    }
  }, [creatLoaderOK, cloudWhiteboard])
}
