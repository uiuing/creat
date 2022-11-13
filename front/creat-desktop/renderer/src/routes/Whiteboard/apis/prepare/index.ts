import { NodeArray } from '@uiuing/creat-loader/types'
import axios from 'axios'

import { httpsApiBaseUrl } from '../common'

// 创建axios实例
const service = axios.create({
  baseURL: httpsApiBaseUrl
})

export const checkWhiteboardShare = (
  whiteboardId: string,
  callback: ({
    status,
    data
  }: {
    status: 200 | 404 | 300
    data?: {
      info: { name: string; readonly: boolean }
      nodes: NodeArray
    }
    msg?: string
  }) => void
) => {
  service
    .get(`/check?whiteboardId=${whiteboardId}`)
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}

export const pickWhiteboardShare = (
  whiteboardId: string,
  callback: ({
    status,
    info,
    nodes
  }: {
    status: 200 | 400 | 500 | 300
    info?: { name: string; readonly: boolean }
    nodes?: NodeArray
    msg?: string
  }) => void
) => {
  service
    .get(`/pick?whiteboardId=${whiteboardId}`)
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}

export const coverWhiteboardShare = (
  {
    nodes,
    info,
    id
  }: {
    nodes: NodeArray
    info: { name: string; readonly: boolean }
    id: { user: string; whiteboard: string }
  },
  callback: ({
    status,
    msg
  }: {
    status: 200 | 400 | 401 | 500 | 300
    msg?: string
  }) => void
) => {
  service
    .post('/cover', { nodes, info, id })
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}

export const createWhiteboardShare = (
  {
    nodes,
    info,
    id
  }: {
    nodes: NodeArray
    info: { name: string; readonly: boolean }
    id: { user: string; whiteboard: string }
  },
  callback: ({
    status,
    msg
  }: {
    status: 200 | 400 | 401 | 500 | 300
    msg?: string
  }) => void
) => {
  service
    .post('/create', { nodes, info, id })
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}

export const closeWhiteboardShare = (
  {
    userId,
    whiteboardId
  }: {
    userId: string
    whiteboardId: string
  },
  callback: ({
    status,
    msg
  }: {
    status: 200 | 400 | 401 | 500 | 300
    msg?: string
  }) => void
) => {
  service
    .post('/close', { userId, whiteboardId })
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}

export const updateWhiteboardShare = (
  {
    userId,
    whiteboardId,
    info
  }: {
    userId: string
    whiteboardId: string
    info: { name: string; readonly: boolean }
  },
  callback: ({
    status,
    msg
  }: {
    status: 200 | 400 | 401 | 500 | 300
    msg?: string
  }) => void
) => {
  service
    .post('/update', { userId, whiteboardId, info })
    .then((res) => {
      callback(res.data)
    })
    .catch(() => {
      callback({ status: 300 })
    })
}
