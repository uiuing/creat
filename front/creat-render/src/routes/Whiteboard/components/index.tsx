import createLoader from 'creat-loader'
import { useLayoutEffect } from 'react'

import { CollatorState } from './CollatorState'
import { FileOperate } from './FileOperate'
import { GlobalOperate } from './GlobalOperate'
import { GraphicOption } from './GraphicOption'
import styles from './style.module.scss'

export function MenuControl() {
  useLayoutEffect(() => {
    window.whiteboard = createLoader({ plotType: 'selection' }).mount(
      '#creat-loader'
    )
  }, [])
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
    </>
  )
}
