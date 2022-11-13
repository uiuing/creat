import { patch } from 'jsondiffpatch'
import PubSub from 'pubsub-js'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { io } from 'socket.io-client'

import { cloudWhiteboardState, creatLoaderOKState } from '../store'
import { GetLocalDataStateObject, removePromise, whiteboardApp } from '../utils'

export default function useSyncWatch() {
  const creatLoaderOK = useRecoilValue(creatLoaderOKState)
  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)
  const setLocalData = useSetRecoilState<any>(GetLocalDataStateObject())

  const [isCloud, setIsCloud] = useState(cloudWhiteboard.isCloud)

  useEffect(() => {
    setIsCloud(cloudWhiteboard.isCloud)
  }, [cloudWhiteboard])

  useEffect(() => {
    if (creatLoaderOK && whiteboardApp() && isCloud) {
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
        const newData = removePromise(patch(nowData.nodes, nodesDelta))
        const ids = new Set()
        const nodes = newData.filter((node: { id: string }) => {
          if (ids.has(node.id)) {
            return false
          }
          ids.add(node.id)
          return true
        })
        whiteboardApp()?.setData(
          {
            state: nowData.state,
            nodes
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

      socket.on('update-info', (info) => {
        setCloudWhiteboard({
          ...cloudWhiteboard,
          ...info
        })
        console.log(info)
      })

      PubSub.subscribe('diff-nodes', (msg, nodesDelta) => {
        socket.emit('diff-nodes', nodesDelta)
      })

      PubSub.subscribe('diff-state', (msg, stateDelta) => {
        socket.emit('diff-state', stateDelta)
      })

      PubSub.subscribe('update-info', (msg, info) => {
        socket.emit('update-info', info)
      })
    }
  }, [creatLoaderOK])
}
