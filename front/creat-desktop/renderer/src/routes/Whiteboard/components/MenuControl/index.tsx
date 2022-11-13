import { LocalData } from '@uiuing/creat-loader/types'
import { useRecoilValue } from 'recoil'

import useSyncWatch from '../../Hooks/useSyncWatch'
import { cloudWhiteboardState } from '../../store'
import { GetLocalDataStateObject } from '../../utils'
import styles from '../style.module.scss'
import { CollatorState } from './CollatorState'
import { FileOperate } from './FileOperate'
import { GlobalOperate } from './GlobalOperate'
import { GraphicOption } from './GraphicOption'
import StyleMenu from './MenuOptions/StyleMenu'

export function MenuControl() {
  const localData = useRecoilValue(GetLocalDataStateObject()) as LocalData
  const cloudWhiteboard = useRecoilValue(cloudWhiteboardState)

  useSyncWatch()

  return (
    <>
      {cloudWhiteboard.isAuthor || !cloudWhiteboard.readonly ? (
        <>
          <div className={styles.graphicOption}>
            <GraphicOption />
          </div>
          <div className={styles.globalOperate}>
            <GlobalOperate />
          </div>
        </>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100vh',
            position: 'fixed',
            zIndex: '900'
          }}
        />
      )}
      <div className={styles.collatorState}>
        <CollatorState />
      </div>
      <div className={styles.fileOperate}>
        <FileOperate />
      </div>
      {localData?.state && localData.state?.readonly ? <></> : <StyleMenu />}
    </>
  )
}
