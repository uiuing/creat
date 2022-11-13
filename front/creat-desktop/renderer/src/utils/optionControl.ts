import { Toast } from '@douyinfe/semi-ui'

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

export function openWhiteboardFile(callback: () => void) {
  const el = document.createElement('input')
  el.style.position = 'fixed'
  el.style.left = '-9999999px'
  el.type = 'file'
  el.accept = '.creat'
  el.onchange = (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(
          decodeURIComponent(escape(atob(reader.result as string)))
        )
        const id = generateId()
        setWhiteboardLocalData(
          data,
          id,
          `${file.name.slice(0, file.name.lastIndexOf('.'))} 副本`
        ).then(() => {
          openWhiteboard(id)
          callback()
        })
      } catch {
        Toast.error('貌似这个文件并没有白板数据～')
      }
    }
    reader.readAsText(file)
  }
  document.body.appendChild(el)
  el.click()
}

export function parseJoinUrl(text: string) {
  // 解析链接是否包含 creat.uiuing.com
  if (text.indexOf('creat.uiuing.com/') > -1) {
    const id = text.split('creat.uiuing.com/')[1]
    openWhiteboard(id)
  } else if (text.indexOf('http') === -1 && text.indexOf('/') === -1) {
    openWhiteboard(text)
  }
  Toast.warning('貌似这个链接并没有白板数据～')
}
