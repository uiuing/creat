import ReconnectingWebSocket from 'reconnecting-websocket'

export function initSyncCloud() {
  window.rws = new ReconnectingWebSocket('ws://localhost:8000/ws', [], {
    debug: false
  })
}

type SyncSocket = ReconnectingWebSocket & {
  send: (message: any) => void
}

export function syncSocket(): SyncSocket {
  return window.rws
}
