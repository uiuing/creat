import { AppResponse } from 'creat-loader/src/types'

export function whiteboardApp(): AppResponse {
  return window.whiteboard
}

export function graphicShortcut(callBack: (key: number) => void) {
  const k = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  let oldK = 'Control'
  document.addEventListener('keydown', (e) => {
    const t = Number(e.key)
    if (k.includes(t)) {
      if (oldK === 'Control') {
        callBack((t === 0 ? 10 : t) - 1)
      }
    }
    oldK = e.key
  })
}
