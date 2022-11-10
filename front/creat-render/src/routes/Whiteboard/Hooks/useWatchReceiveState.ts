import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { syncSocket } from '../../../api/ws/sync'
import {
  changeShareState,
  joinShareState,
  quitShareState,
  socketIsOKState,
  syncMouseState
} from '../store/cooperationReceive'
import { whiteboardApp } from '../utils'

const nodesTypes = [
  'add',
  'delete',
  'update',
  'cover-all',
  'delete-all',
  'update-state'
]

const meetingTypes = ['join_meeting', 'quit_meeting', 'change_meeting']

export function useWatchReceiveState() {
  const [canDo, setCanDo] = useState(false)

  const setSyncMouse = useSetRecoilState(syncMouseState)
  const setJoinShare = useSetRecoilState(joinShareState)
  const setChangeShare = useSetRecoilState(changeShareState)
  const setQuiteShare = useSetRecoilState(quitShareState)
  const setSocketIsOK = useSetRecoilState(socketIsOKState)
  useEffect(() => {
    if (syncSocket()) {
      setCanDo(true)
    }
    if (canDo) {
      syncSocket()?.addEventListener('message', (event) => {
        if (event.data) {
          const data = JSON.parse(event.data)
          if ('type' in data) {
            if (data.type === 'sync_mouse') {
              setSyncMouse(data)
            }
            if (meetingTypes.includes(data.type)) {
              if (data.type === 'join_meeting') {
                setJoinShare(data)
              }
              if (data.type === 'change_meeting') {
                setChangeShare(data)
              }
              if (data.type === 'quit_meeting') {
                setQuiteShare(data)
              }
            }
            if (
              nodesTypes.includes(data.type) ||
              data.type === 'update-state'
            ) {
              whiteboardApp()?.parseSetDiffData(data)
            }
          } else {
            console.info(data)
          }
        }
      })
      syncSocket()?.addEventListener('open', () => {
        setSocketIsOK(true)
      })

      syncSocket()?.addEventListener('close', () => {
        window.noOnceJoinShare = false
        window.noOnceCreatShare = false
        window.noOnceCheckShare = false
        setSocketIsOK(false)
      })
    }
  }, [canDo])

  return { canDo }
}
