import { generateId, setWhiteboardLocalData } from './data'

export function openWhiteboard(id: string) {
  window.open(`/${id}`)
}

export function createWhiteboard(callback: () => Promise<void>) {
  const id = generateId()
  setWhiteboardLocalData([] as any, id).then(() => {
    callback().then(() => {
      openWhiteboard(id)
    })
  })
}

export function openWhiteboardFile() {
  console.log('openWhiteboardFile')
}

export function joinMeeting() {
  console.log('joinMeeting')
}
