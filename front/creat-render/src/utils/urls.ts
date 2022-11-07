export function parseUrlWhiteboardId(): string {
  const id = window.location.pathname.replaceAll('/', '')
  window.whiteboardId = id
  return id
}

export function setTitle(content: string, isAddIt?: boolean): void {
  const { title } = document
  if (title === content) return
  document.title = isAddIt ? title + content : content
}
