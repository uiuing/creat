import styles from '../style.module.scss'
import { CollatorState } from './CollatorState'
import { FileOperate } from './FileOperate'
import { GlobalOperate } from './GlobalOperate'
import { GraphicOption } from './GraphicOption'
import StyleMenu from './MenuOptions/StyleMenu'

export function MenuControl() {
  return (
    <>
      <div className={styles.graphicOption}>
        <GraphicOption />
      </div>
      <div className={styles.collatorState}>
        <CollatorState />
      </div>
      <div className={styles.globalOperate}>
        <GlobalOperate />
      </div>
      <div className={styles.fileOperate}>
        <FileOperate />
      </div>
      <StyleMenu />
    </>
  )
}
