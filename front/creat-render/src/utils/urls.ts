export function getWhiteboardId(): string {
  return window.location.pathname.replaceAll('/', '')
}

export function setTitle(content: string, isAddIt?: boolean): void {
  const { title } = document
  if (title === content) return
  document.title = isAddIt ? title + content : content
}
