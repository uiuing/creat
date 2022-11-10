import { DiffNodesRes } from '@uiuing/creat-loader/src/types'
import { DiffStateRes } from '@uiuing/creat-loader/types'

import { syncSocket } from '../../../../api/ws/sync'
import {
  getUserInfo,
  getUserTmpInfo,
  getWhiteboardInfoById,
  setUserTmpInfo
} from '../../../../utils/data'
import { whiteboardApp } from '../index'

function watchResponse(callback: (data: any) => void) {
  syncSocket()?.addEventListener('message', (event) => {
    if (event.data) {
      const data = JSON.parse(event.data)
      if (!('type' in data)) {
        callback(data)
      }
    }
  })
}

export function checkShare(callback: (data: any) => void) {
  watchResponse(callback)
  syncSocket()?.send(
    JSON.stringify({
      type: 'check_meeting',
      whiteboard: {
        id: window.whiteboardId
      }
    })
  )
}

export async function creatShare() {
  const whiteboardInfo = await getWhiteboardInfoById(window.whiteboardId)
  const userInfo = await getUserInfo()
  syncSocket()?.send(
    JSON.stringify({
      type: 'create_meeting',
      whiteboard: {
        id: whiteboardInfo?.id,
        name: whiteboardInfo?.name,
        nodes: whiteboardApp()?.getData(),
        readonly: whiteboardInfo?.recentlyOpened
      },
      user: {
        id: userInfo.id,
        name: userInfo.name,
        color: '#000000'
      }
    })
  )
}

export async function joinShare(
  callback: (data: any) => void,
  userName?: string,
  userColor?: string
) {
  const userInfo = await getUserInfo()
  const userTmpInfo = await getUserTmpInfo()

  if (userName) {
    await setUserTmpInfo({ name: userName, color: userTmpInfo.color })
    userTmpInfo.name = userName
  }
  if (userColor) {
    await setUserTmpInfo({
      name: userTmpInfo.name,
      color: (await getUserTmpInfo()).color
    })
    userTmpInfo.color = userColor
  }

  watchResponse(callback)

  syncSocket()?.send(
    JSON.stringify({
      type: 'join_meeting',
      whiteboard: {
        id: window.whiteboardId
      },
      user: {
        id: userInfo.id,
        name: userName || userTmpInfo.name,
        color: userColor || userTmpInfo.color
      }
    })
  )
}

export async function closeShare() {
  const userInfo = await getUserInfo()
  syncSocket()?.send(
    JSON.stringify({
      type: 'close_meeting',
      user: {
        id: userInfo.id
      }
    })
  )
}

export async function changeShare(
  whiteboardName?: string,
  whiteboardReadonly?: boolean
) {
  const msg = {
    type: 'change_meeting',
    whiteboard: {}
  }
  if (whiteboardName) {
    // @ts-ignore
    msg.whiteboard.name = whiteboardName
  }
  if (whiteboardReadonly) {
    // @ts-ignore
    msg.whiteboard.readonly = whiteboardReadonly
  }
  syncSocket()?.send(msg)
}

export function syncNodes(diffNodesRes: DiffNodesRes) {
  syncSocket()?.send(diffNodesRes)
}

export async function syncMouse(coordinate: {
  x: number
  y: number
  isMousedown: boolean
}) {
  const userTmpInfo = await getUserTmpInfo()

  syncSocket()?.send(
    JSON.stringify({
      type: 'sync_mouse',
      coordinate,
      user: {
        name: userTmpInfo.name,
        color: userTmpInfo.color
      }
    })
  )
}

export async function updateState(diffStateRes: DiffStateRes) {
  syncSocket()?.send(JSON.stringify(diffStateRes))
}
