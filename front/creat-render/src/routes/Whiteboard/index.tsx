import { parseUrlWhiteboardId } from '../../utils/urls'
import { MenuControl } from './components'
import styles from './style.module.scss'

parseUrlWhiteboardId()

export default function Whiteboard() {
  return (
    <>
      <div id="creat-loader" className={styles.creatLoader} />
      <MenuControl />
    </>
  )
}
