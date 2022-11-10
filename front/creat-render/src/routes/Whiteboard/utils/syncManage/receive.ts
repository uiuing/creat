/* eslint-disable react-hooks/rules-of-hooks */

import { useSetRecoilState } from 'recoil'

import { syncSocket } from '../../../../api/ws/sync'
import {
  changeShareState,
  joinShareState,
  quitShareState,
  socketIsOKState,
  syncMouseState
} from '../../store/cooperationReceive'
import { whiteboardApp } from '../index'

const nodesTypes = ['add', 'delete', 'update', 'cover-all', 'delete-all']

const meetingTypes = ['join_meeting', 'quit_meeting', 'change_meeting']

export function WatchReceiveState() {
  syncSocket()?.addEventListener('message', (event) => {
    if (event.data) {
      const data = JSON.parse(event.data)
      if ('type' in data) {
        if (data.type === 'sync_mouse') {
          useSetRecoilState(syncMouseState)(data)
        }
        if (meetingTypes.includes(data.type)) {
          if (data.type === 'join_meeting') {
            useSetRecoilState(joinShareState)(data)
          }
          if (data.type === 'change_meeting') {
            useSetRecoilState(changeShareState)(data)
          }
          if (data.type === 'quit_meeting') {
            useSetRecoilState(quitShareState)(data)
          }
        }
        if (nodesTypes.includes(data.type) || data.type === 'update-state') {
          whiteboardApp()?.parseSetDiffData(data)
        }
      }
    }
  })

  syncSocket()?.addEventListener('open', () => {
    useSetRecoilState(socketIsOKState)(true)
  })

  syncSocket()?.addEventListener('close', () => {
    useSetRecoilState(socketIsOKState)(false)
  })
}
