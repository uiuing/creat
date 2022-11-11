import ReconnectingWebSocket from 'reconnecting-websocket'

export function initSyncCloud() {
  if (!window.rws) {
    window.rws = new ReconnectingWebSocket('ws://localhost:8000/ws', [], {
      debug: false,
      maxRetries: 5
    })
  }
}

type SyncSocket = ReconnectingWebSocket & {
  send: (message: any) => void
}

export function syncSocket(): SyncSocket {
  return window.rws
}
