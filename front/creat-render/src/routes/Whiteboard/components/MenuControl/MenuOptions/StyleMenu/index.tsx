import {
  Button,
  Collapsible,
  Radio,
  RadioGroup,
  Slider,
  Typography
} from '@douyinfe/semi-ui'
import { Node, NodeArray } from 'creat-loader/src/types'
import { useState } from 'react'

import { whiteboardApp } from '../../../../utils'
import styles from './style.module.scss'

export default function StyleMenu() {
  const [activeNodeObject, setActiveNodeObject] = useState<Node | undefined>(
    undefined
  )
  const [activeNodesArray, setActiveNodesArray] = useState<
    NodeArray | undefined
  >(undefined)
  // TODO: 设置缓存，好看一点
  whiteboardApp().watch.activeNodeChange((node: any) => {
    setActiveNodeObject(node)
  })
  whiteboardApp().watch.multiplexSelectChange((nodes: any) => {
    setActiveNodesArray(nodes)
  })
  const hasActiveNodesArray = () =>
    !!activeNodesArray && activeNodesArray.length > 0

  return (
    <Collapsible
      className={styles.wrapper}
      isOpen={
        !!activeNodeObject || (activeNodesArray && activeNodesArray.length > 0)
      }
    >
      <div className={styles.content}>
        <RenderMenus
          activeNodeObject={activeNodeObject as any}
          hasActiveNodesArray={hasActiveNodesArray}
        />
      </div>
    </Collapsible>
  )
}

function RenderMenus({
  activeNodeObject,
  hasActiveNodesArray
}: {
  activeNodeObject: Node
  hasActiveNodesArray: () => boolean
}) {
  const { Text } = Typography
  const [rotate, setRotate] = useState(
    Math.floor(activeNodeObject?.rotate ? activeNodeObject.rotate : 0)
  )
  whiteboardApp().watch.nodeRotateChange((r) => {
    setRotate(r)
  })
  // TODO：颜色的选择和样式的修改
  return (
    <>
      <div>
        <Text>描边</Text>
        <div className={styles.option}>
          <Button
            className={styles.colorSelection}
            style={{ backgroundColor: activeNodeObject?.style?.strokeStyle }}
          />
          <Text>
            {activeNodeObject?.style
              ? activeNodeObject?.style?.strokeStyle
              : '选择颜色将覆盖'}
          </Text>
        </div>
      </div>
      <div>
        <Text>填充</Text>
        <div className={styles.option}>
          <Button
            className={styles.colorSelection}
            style={{ backgroundColor: activeNodeObject?.style?.fillStyle }}
          />
          <Text>
            {(() => {
              if (activeNodeObject?.style) {
                return activeNodeObject?.style?.fillStyle === 'transparent'
                  ? '透明'
                  : activeNodeObject?.style?.fillStyle
              }
              return '选择颜色将覆盖'
            })()}
          </Text>
        </div>
      </div>
      {!['image', 'text'].includes(activeNodeObject?.type) ||
      hasActiveNodesArray() ? (
        <div className={styles.item}>
          <Text>描边宽度</Text>
          <RadioGroup
            type="button"
            buttonSize="middle"
            defaultValue={1}
            value={activeNodeObject?.style?.lineWidth}
          >
            <Radio value={2}>S</Radio>
            <Radio value={6}>M</Radio>
            <Radio value={10}>L</Radio>
          </RadioGroup>
        </div>
      ) : (
        <></>
      )}
      {!['arbitrary-plot', 'image', 'text'].includes(activeNodeObject?.type) ||
      hasActiveNodesArray() ? (
        <div className={styles.item}>
          <Text>边框样式</Text>
          <RadioGroup
            type="button"
            buttonSize="middle"
            value={activeNodeObject?.style?.lineDash}
          >
            <Radio value={0}>0</Radio>
            <Radio value={5}>5</Radio>
            <Radio value={2}>2</Radio>
          </RadioGroup>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.item}>
        <Text>透明度</Text>
        <Slider
          value={
            activeNodeObject?.style
              ? activeNodeObject.style.globalAlpha * 100
              : 100
          }
          step={5}
          tipFormatter={(str) => `${str}%`}
        />
      </div>
      <div className={styles.item}>
        <Text>角度</Text>
        <Slider
          max={360}
          min={0}
          step={1}
          value={rotate}
          tipFormatter={(str) => `${str}`}
        />
      </div>
      <div>
        <Text>操作</Text>
        <div className={styles.option}>
          <div>删除</div>
          <div>复制</div>
        </div>
      </div>
    </>
  )
}
