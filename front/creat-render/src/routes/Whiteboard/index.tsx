import LayoutPage from './components/Layout'
import styles from './style.module.scss'

export default function Whiteboard() {
  return (
    <>
      <LayoutPage />
      <div id="creat-loader" className={styles.creatLoader} />
    </>
  )
}
