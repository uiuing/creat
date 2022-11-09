import {
  Button,
  Collapsible,
  Divider,
  Radio,
  RadioGroup,
  Slider,
  Typography
} from '@douyinfe/semi-ui'
import { Node } from 'creat-loader/src/types'
import { useEffect, useState } from 'react'
import { TwitterPicker } from 'react-color'

import CopySvg from '../../../../../components/svgs/CopySvg'
import DotLineSvg from '../../../../../components/svgs/DotLineSvg'
import DotPLineSvg from '../../../../../components/svgs/DotPLineSvg'
import SolidLineSvg from '../../../../../components/svgs/SolidLineSvg'
import TrashSvg from '../../../../../components/svgs/TrashSvg'
import { whiteboardApp } from '../../../../utils'
import styles from './style.module.scss'

export default function StyleMenu() {
  const [activeNodeObject, setActiveNodeObject] = useState<Node | undefined>(
    undefined
  )
  const [activeNodesArray, setActiveNodesArray] = useState<any>(undefined)
  // TODO: 设置缓存，好看一点
  whiteboardApp().watch.activeNodeChange((node: any) => {
    setActiveNodeObject(node)
  })
  whiteboardApp().watch.multiplexSelectChange((nodes: any) => {
    setActiveNodesArray(nodes)
  })
  const hasActiveNodesArray = () =>
    !!activeNodesArray && activeNodesArray.length > 0

  const { Text } = Typography

  const [changeColorType, setChangeColorType] = useState<undefined | string>(
    undefined
  )

  const [strokeStyle, setStrokeStyle] = useState(
    activeNodeObject?.style?.strokeStyle
      ? activeNodeObject?.style?.strokeStyle
      : '#000000'
  )
  const [fillStyle, setFillStyle] = useState(
    activeNodeObject?.style?.fillStyle
      ? activeNodeObject?.style?.fillStyle
      : 'transparent'
  )
  const [lineWidth, setLineWidth] = useState(
    activeNodeObject?.style?.lineWidth ? activeNodeObject?.style?.lineWidth : 2
  )
  const [globalAlpha, setGlobalAlpha] = useState(
    (() => {
      if (activeNodeObject?.style?.globalAlpha) {
        if (activeNodeObject?.style?.globalAlpha === 'transparent') {
          return 0
        }
        return activeNodeObject?.style?.globalAlpha
      }
      return 1
    })()
  )
  const [rotate, setRotate] = useState(
    Math.floor(activeNodeObject?.rotate ? activeNodeObject.rotate : 0)
  )
  const [lineDash, setLineDash] = useState(
    activeNodeObject?.style?.lineDash ? activeNodeObject?.style?.lineDash : 0
  )

  whiteboardApp().watch.nodeRotateChange((r) => {
    setRotate(r)
  })
  useEffect(() => {
    // TODO: 关于多选的时候颜色选取显示怎么样更好？
    if (activeNodeObject || (activeNodesArray && activeNodesArray.length > 0)) {
      setStrokeStyle(
        activeNodeObject?.style?.strokeStyle ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.style
            ? activeNodesArray[0]?.style?.strokeStyle
            : '#000000')
      )
      setFillStyle(
        activeNodeObject?.style?.fillStyle ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.style
            ? activeNodesArray[0]?.style?.fillStyle
            : 'transparent')
      )
      setLineWidth(
        activeNodeObject?.style?.lineWidth ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.style
            ? activeNodesArray[0]?.style?.lineWidth
            : 2)
      )
      setGlobalAlpha(
        activeNodeObject?.style?.globalAlpha ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.style
            ? activeNodesArray[0]?.style?.globalAlpha
            : 1)
      )
      setRotate(
        activeNodeObject?.rotate ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.rotate
            ? activeNodesArray[0]?.rotate
            : 0)
      )
      setLineDash(
        activeNodeObject?.style?.lineDash ||
          (activeNodesArray &&
          activeNodesArray.length === 1 &&
          activeNodesArray[0]?.style
            ? activeNodesArray[0]?.style?.lineDash
            : 0)
      )
    }
  }, [activeNodeObject, activeNodesArray])

  return (
    <div style={{ position: 'absolute', right: 15, top: 100, zIndex: 800 }}>
      <div
        onMouseLeave={() => {
          setChangeColorType(undefined)
        }}
      >
        <Collapsible
          className={styles.wrapper}
          style={{
            marginBottom: typeof changeColorType !== 'undefined' ? 15 : 0
          }}
          isOpen={typeof changeColorType !== 'undefined'}
        >
          {/* 更多颜色样式和设置 */}
          <TwitterPicker
            color={(() => {
              if (activeNodeObject?.style && changeColorType) {
                return changeColorType in activeNodeObject.style
                  ? // @ts-ignore
                    activeNodeObject?.style[changeColorType]
                  : '#000000'
              }
              return '#000000'
            })()}
            triangle="hide"
            onChangeComplete={(color) => {
              if (changeColorType) {
                whiteboardApp().setCurrentNodesStyle({
                  [changeColorType]: color.hex
                })
                if (changeColorType === 'strokeStyle') {
                  setStrokeStyle(color.hex)
                }
                if (changeColorType === 'fillStyle') {
                  setFillStyle(color.hex)
                }
              }
            }}
          />
        </Collapsible>
      </div>
      {/* TODO: 是不是要在css中留容错空间，待考虑 */}
      <Collapsible
        className={styles.selectionWrapper}
        isOpen={
          !!activeNodeObject ||
          (activeNodesArray && activeNodesArray.length > 0)
        }
      >
        <div className={styles.content}>
          <div className={styles.colorItem} id="color-button">
            <div className={styles.colorItemOption}>
              <Text>描边</Text>
              <Text>填充</Text>
            </div>
            <Divider margin="5px" />
            <div className={styles.colorItemOption}>
              <div className={styles.option}>
                <Button
                  className={styles.colorSelection}
                  onClick={() => {
                    setChangeColorType('strokeStyle')
                  }}
                  style={{ backgroundColor: strokeStyle }}
                />
              </div>
              <div className={styles.option}>
                <Button
                  onClick={() => {
                    setChangeColorType('fillStyle')
                  }}
                  className={styles.colorSelection}
                  style={{ backgroundColor: fillStyle }}
                />
              </div>
            </div>
          </div>
          {(activeNodeObject &&
            !['arbitrary-plot', 'image', 'text'].includes(
              activeNodeObject?.type
            )) ||
          hasActiveNodesArray() ? (
            <div className={styles.item}>
              <Text>边框样式</Text>
              <Divider margin="5px" />
              <RadioGroup
                type="button"
                buttonSize="middle"
                value={lineDash}
                onChange={(v) => {
                  whiteboardApp().setCurrentNodesStyle({
                    lineDash: v.target.value
                  })
                  setLineDash(v.target.value)
                }}
                style={{ borderRadius: 7, margin: '3 0' }}
              >
                <Radio value={0} className={styles.radioOption}>
                  <SolidLineSvg width={20} height={20} />
                </Radio>
                <Radio value={5} className={styles.radioOption}>
                  <DotLineSvg width={20} height={20} />
                </Radio>
                <Radio value={2} className={styles.radioOption}>
                  <DotPLineSvg width={20} height={20} />
                </Radio>
              </RadioGroup>
            </div>
          ) : (
            <></>
          )}
          {(activeNodeObject &&
            !['image', 'text'].includes(activeNodeObject?.type)) ||
          hasActiveNodesArray() ? (
            <div className={styles.item}>
              <Text>描边宽度</Text>
              <Divider margin="5px 0 0 0" />
              <Slider
                min={2}
                max={16}
                value={lineWidth}
                step={2}
                onChange={(v) => {
                  whiteboardApp().setCurrentNodesStyle({
                    lineWidth: v as number
                  })
                  setLineWidth(v as number)
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <div className={styles.item}>
            <Text>透明度</Text>
            <Divider margin="5px 0 0 0" />
            <Slider
              value={globalAlpha ? globalAlpha * 100 : 100}
              step={1}
              tipFormatter={(str) => `${str}%`}
              onChange={(a) => {
                whiteboardApp().setCurrentNodesStyle({
                  globalAlpha: (a as number) / 100
                })
                setGlobalAlpha((a as number) / 100)
              }}
            />
          </div>
          {(() => {
            if (!activeNodeObject && activeNodesArray) {
              return <></>
            }
            return (
              <div className={styles.item}>
                <Text>角度</Text>
                <Divider margin="5px 0 0 0" />
                <Slider
                  max={360}
                  min={0}
                  step={1}
                  value={rotate}
                  tipFormatter={(str) => `${str}`}
                  onChange={(r) => {
                    whiteboardApp().updateActiveNodeRotate(r as number)
                    setRotate(r as number)
                  }}
                />
              </div>
            )
          })()}
          <div>
            <Text>操作</Text>
            <Divider margin="5px" />
            <div className={styles.option}>
              <Button
                theme="borderless"
                icon={<TrashSvg width={17} height={17} fill="#3d3d3d" />}
                onClick={() => {
                  whiteboardApp().deleteCurrentNodes()
                }}
              />
              <Button
                theme="borderless"
                icon={<CopySvg width={17} height={17} fill="#3d3d3d" />}
                onClick={() => {
                  whiteboardApp().copyPasteCurrentNodes()
                }}
              />
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}
