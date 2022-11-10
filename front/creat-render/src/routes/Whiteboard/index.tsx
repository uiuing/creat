import LayoutPage from './components/Layout'
import { parseUrlWhiteboardId } from './Hooks/parse'
import styles from './style.module.scss'

parseUrlWhiteboardId()

export default function Whiteboard() {
  return (
    <>
      <LayoutPage />
      <div id="creat-loader" className={styles.creatLoader} />
    </>
  )
}
