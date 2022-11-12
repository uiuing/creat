import LayoutPage from './LayoutPage'
import styles from './style.module.scss'

// 初始化白板ID信息
window.whiteboardId = window.location.pathname.replaceAll('/', '')

export default function Whiteboard() {
  return (
    <>
      <LayoutPage />
      <div id="creat-loader" className={styles.creatLoader} />
    </>
  )
}
