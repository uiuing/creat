import LayoutPage from './LayoutPage'
import styles from './style.module.scss'

// 初始化白板ID信息
window.whiteboardId = window.location.pathname.replaceAll('/', '')
const h = window.location.host
if (
  h !== 'creat.uiuing.com' &&
  h !== '127.0.0.1:5173' &&
  h !== 'localhost:5173'
) {
  window.location.replace(`https://creat.uiuing.com${window.location.pathname}`)
}

export default function Whiteboard() {
  return (
    <>
      <LayoutPage />
      <div id="creat-loader" className={styles.creatLoader} />
    </>
  )
}
