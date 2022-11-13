import { Button, Tooltip } from '@douyinfe/semi-ui'
import { useRecoilValue } from 'recoil'

import { cloudWhiteboardState } from '../../../store'
import styles from './style.module.scss'

export function FileOperate() {
  const cloudWhiteboard = useRecoilValue(cloudWhiteboardState)

  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <Tooltip content="退出白板">
          <Button
            type="tertiary"
            onClick={() => {
              window.location.href = `http://${window.location.host}`
            }}
          >
            {'<'}
          </Button>
        </Tooltip>
        <Button>{cloudWhiteboard.name}</Button>
      </div>
    </div>
  )
}
