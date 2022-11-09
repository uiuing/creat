import { LocalData } from 'creat-loader/src/types'
import { useRecoilValue } from 'recoil'

import { localDataState } from '../../store'
import styles from '../style.module.scss'
import { CollatorState } from './CollatorState'
import { FileOperate } from './FileOperate'
import { GlobalOperate } from './GlobalOperate'
import { GraphicOption } from './GraphicOption'
import StyleMenu from './MenuOptions/StyleMenu'

export function MenuControl() {
  const localData = useRecoilValue(localDataState) as LocalData
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
      {localData?.state && localData.state?.readonly ? <></> : <StyleMenu />}
    </>
  )
}
