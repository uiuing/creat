import { Button } from '@douyinfe/semi-ui'
import { PlotType } from 'creat-loader/src/types'
import { useEffect, useLayoutEffect } from 'react'
import { useRecoilState } from 'recoil'

import ArrowSvg from '../../../components/svgs/ArrowSvg'
import CircleSvg from '../../../components/svgs/CircleSvg'
import DiamondSvg from '../../../components/svgs/DiamondSvg'
import ImageSvg from '../../../components/svgs/ImageSvg'
import LineSvg from '../../../components/svgs/LineSvg'
import PaintbrushSvg from '../../../components/svgs/PaintbrushSvg'
import SelectionSvg from '../../../components/svgs/SelectionSvg'
import SquareSvg from '../../../components/svgs/SquareSvg'
import TextSvg from '../../../components/svgs/TextSvg'
import TriangleSvg from '../../../components/svgs/TriangleSvg'
import {
  whiteboardGlobalState,
  whiteboardLocalDataState
} from '../../../Home/store'
import { graphicShortcut, whiteboardApp } from '../../utils'
import styles from './style.module.scss'

let isOnceLoader = true

export function GraphicOption() {
  const [whiteboardState, setWhiteboardState] = useRecoilState(
    whiteboardGlobalState
  )
  const [whiteboardLocalData, setWhiteboardLocalData] = useRecoilState(
    whiteboardLocalDataState
  )

  useEffect(() => {
    if (isOnceLoader && 'state' in whiteboardLocalData) {
      whiteboardApp()?.setData(whiteboardLocalData as any, false)
      isOnceLoader = false
    }
  }, [whiteboardLocalData])

  const Options: Array<{ type: PlotType; icon: any }> = [
    {
      type: 'selection',
      icon: SelectionSvg
    },
    {
      type: 'arbitrary-plot',
      icon: PaintbrushSvg
    },
    {
      type: 'rectangle',
      icon: SquareSvg
    },
    {
      type: 'diamond',
      icon: DiamondSvg
    },
    {
      type: 'triangle',
      icon: TriangleSvg
    },
    {
      type: 'circle',
      icon: CircleSvg
    },
    {
      type: 'line',
      icon: LineSvg
    },
    {
      type: 'arrow',
      icon: ArrowSvg
    },
    {
      type: 'text',
      icon: TextSvg
    },
    {
      type: 'image',
      icon: ImageSvg
    }
  ]

  const changeCurrentType = (currentType: PlotType) => {
    if (currentType === whiteboardState.currentType) {
      return
    }
    whiteboardApp().cancelActiveNode()
    setWhiteboardState({
      ...whiteboardState,
      currentType
    })
    whiteboardApp().updateCurrentType(currentType)
  }

  whiteboardApp()?.watch.currentTypeChange((currentType) => {
    setWhiteboardState({
      ...whiteboardState,
      currentType
    })
  })

  whiteboardApp()?.watch.localDataChange((localData) => {
    setWhiteboardLocalData(localData)
  })

  graphicShortcut((key) => {
    changeCurrentType(Options[key].type)
  })

  return (
    <>
      <div className={styles.group}>
        {Options.map((option, index) => (
          <Button
            key={index}
            type="primary"
            theme={
              whiteboardState.currentType === option.type
                ? 'light'
                : 'borderless'
            }
            size="large"
            className={styles.option}
            icon={
              <option.icon
                width={20}
                height={20}
                fill={
                  whiteboardState.currentType === option.type
                    ? 'rgb(0,100,250)'
                    : '#3d3d3d'
                }
              />
            }
            onClick={() => changeCurrentType(option.type)}
          />
        ))}
      </div>
    </>
  )
}
