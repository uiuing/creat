import { Button, ButtonGroup, Toast, Tooltip } from '@douyinfe/semi-ui'
import { useRecoilState, useRecoilValue } from 'recoil'

import LockOpenSvg from '../../../../components/svgs/LockOpenSvg'
import LockSvg from '../../../../components/svgs/LockSvg'
import { cloudWhiteboardState } from '../../../store'
import { socketIsOKState } from '../../../store/cooperationReceive'
import { changeShare, creatShare } from '../../../utils/sendMessage'
import styles from './style.module.scss'

const defaultStyle = {
  width: 20,
  height: 20,
  fill: '#3d3d3d'
}

export function CollatorState() {
  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)
  const socketIsOK = useRecoilValue(socketIsOKState)

  return (
    <div className={styles.wrapper}>
      <ButtonGroup type="tertiary" theme="borderless" className={styles.group}>
        <Tooltip
          content={cloudWhiteboard.readonly ? '让协作者可编辑' : '让协作者只读'}
          position="bottomRight"
        >
          <Button
            icon={
              cloudWhiteboard.readonly ? (
                <LockSvg {...defaultStyle} />
              ) : (
                <LockOpenSvg {...defaultStyle} />
              )
            }
            onClick={() => {
              if (socketIsOK) {
                if (cloudWhiteboard.isCloud) {
                  changeShare({
                    whiteboardReadonly: !cloudWhiteboard.readonly
                  }).then(() => {
                    setCloudWhiteboard({
                      ...cloudWhiteboard,
                      readonly: !cloudWhiteboard.readonly
                    })
                  })
                } else {
                  Toast.warning({ content: '请创建白板会议之后再试～' })
                }
              } else {
                Toast.error({ content: '请检查网络之后再试～' })
              }
            }}
          />
        </Tooltip>
        <Tooltip content="创建会议">
          <Button
            icon={
              cloudWhiteboard.isCloud ? (
                <LockSvg {...defaultStyle} />
              ) : (
                <LockOpenSvg {...defaultStyle} />
              )
            }
            onClick={() => {
              if (socketIsOK) {
                creatShare().then(() => {
                  if (!window.noOnceCreatShare) {
                    setCloudWhiteboard({
                      ...cloudWhiteboard,
                      isCloud: !cloudWhiteboard.isCloud
                    })
                    window.noOnceCreatShare = true
                  }
                })
              } else {
                Toast.error({ content: '请检查网络之后再试～' })
              }
            }}
          />
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}
