import {
  Button,
  ButtonGroup,
  Collapsible,
  Divider,
  Tooltip
} from '@douyinfe/semi-ui'
import { LocalData } from 'creat-loader/src/types'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

import EditSvg from '../../../../components/svgs/EditSvg'
import GridsSvg from '../../../../components/svgs/GridsSvg'
import LocationSvg from '../../../../components/svgs/LocationSvg'
import ReadSvg from '../../../../components/svgs/ReadSvg'
import RotateLeftRightSvg from '../../../../components/svgs/RotateLeftRightSvg'
import TrashSvg from '../../../../components/svgs/TrashSvg'
import { localDataState } from '../../../store'
import { whiteboardApp } from '../../../utils'
import styles from './style.module.scss'

export function GlobalOperate() {
  return (
    <div className={styles.wrapper}>
      <ScaleOperate />
      <HistoryOperate />
      <Divider layout="vertical" />
      <AuthorGridsEraserOperate />
    </div>
  )
}

function ScaleOperate() {
  const localData = useRecoilValue(localDataState) as LocalData
  const getScale = () => Math.floor((localData?.state?.scale || 1) * 100)
  return (
    <ButtonGroup type="tertiary" theme="borderless" className={styles.group}>
      <Button
        onClick={() => whiteboardApp().zoomOut()}
        disabled={getScale() <= 0}
      >
        -
      </Button>
      <Button onClick={() => whiteboardApp().setZoom(1)}>
        <Tooltip content="重置缩放">{getScale()}%</Tooltip>
      </Button>
      <Button onClick={() => whiteboardApp().zoomIn()}>+</Button>
    </ButtonGroup>
  )
}

function HistoryOperate() {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  whiteboardApp().watch.shuttle((index, length) => {
    setCanUndo(index > 0)
    setCanRedo(index < length - 1)
  })
  return (
    <ButtonGroup type="tertiary" className={styles.group}>
      <Tooltip content="撤销">
        <Button
          onClick={() => whiteboardApp().undo()}
          disabled={!canUndo}
          icon={
            <RotateLeftRightSvg
              isLeft
              width={15}
              height={15}
              fill={canUndo ? '#3d3d3d' : 'rgb(28 31 35 / 35%)'}
            />
          }
        />
      </Tooltip>
      <Divider layout="vertical" />
      <Tooltip content="重做">
        <Button
          onClick={() => whiteboardApp().redo()}
          disabled={!canRedo}
          icon={
            <RotateLeftRightSvg
              isLeft={false}
              width={15}
              height={15}
              fill={canRedo ? '#3d3d3d' : 'rgb(28 31 35 / 35%)'}
            />
          }
        />
      </Tooltip>
    </ButtonGroup>
  )
}

function AuthorGridsEraserOperate() {
  const localData = useRecoilValue(localDataState) as LocalData
  return (
    <>
      <ButtonGroup type="tertiary" className={styles.group}>
        <Tooltip
          content={
            localData?.state?.readonly ? '切换到编辑模式' : '切换到只读模式'
          }
        >
          <Button
            onClick={() => {
              whiteboardApp().updateCurrentType('selection')
              if (localData?.state?.readonly) {
                whiteboardApp().setEditAuthor()
              } else {
                whiteboardApp().setReadonlyAuthor()
              }
            }}
            icon={
              localData?.state?.readonly ? (
                <ReadSvg width={15} height={15} fill="#3d3d3d" />
              ) : (
                <EditSvg width={15} height={15} fill="#3d3d3d" />
              )
            }
          />
        </Tooltip>
        <Divider layout="vertical" />
        <Tooltip content="网格">
          <Button
            onClick={() => {
              if (localData?.state?.showGrid) {
                whiteboardApp().hideGrid()
              } else {
                whiteboardApp().showGrid()
              }
            }}
            icon={
              <GridsSvg
                width={15}
                height={15}
                fill={localData?.state?.showGrid ? 'rgb(0,100,250)' : '#3d3d3d'}
              />
            }
          />
        </Tooltip>
        <Divider layout="vertical" />
        <Tooltip content="回到白板中心">
          <Button
            onClick={whiteboardApp().scrollToCenter}
            icon={<LocationSvg width={15} height={15} fill="#3d3d3d" />}
          />
        </Tooltip>
      </ButtonGroup>
      {localData?.state?.readonly ? (
        <></>
      ) : (
        <>
          <ButtonGroup type="tertiary" className={styles.group}>
            <Tooltip content="清空白板">
              <Button
                onClick={whiteboardApp().empty}
                icon={
                  <TrashSvg
                    width={15}
                    height={15}
                    fill={
                      localData?.state?.readonly
                        ? 'rgb(28 31 35 / 35%)'
                        : '#3d3d3d'
                    }
                  />
                }
              />
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup type="tertiary" className={styles.group}>
            <Tooltip content="设置背景颜色">
              {/* TODO 设置背景颜色 */}
              <Button className={styles.buttonNoPadding}>
                <div
                  style={{
                    width: 32,
                    height: 27,
                    borderRadius: 6,
                    backgroundColor: localData?.state
                      ? localData?.state?.backgroundColor
                      : 'transparent'
                  }}
                />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </>
      )}
    </>
  )
}
