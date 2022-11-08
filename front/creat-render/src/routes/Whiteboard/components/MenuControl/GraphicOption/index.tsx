import { Button, Collapsible } from '@douyinfe/semi-ui'
import { LocalData, PlotType } from 'creat-loader/src/types'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

import ArrowSvg from '../../../../components/svgs/ArrowSvg'
import CircleSvg from '../../../../components/svgs/CircleSvg'
import DiamondSvg from '../../../../components/svgs/DiamondSvg'
import EraserSvg from '../../../../components/svgs/EraserSvg'
import ImageSvg from '../../../../components/svgs/ImageSvg'
import LineSvg from '../../../../components/svgs/LineSvg'
import PaintbrushSvg from '../../../../components/svgs/PaintbrushSvg'
import SelectionSvg from '../../../../components/svgs/SelectionSvg'
import SquareSvg from '../../../../components/svgs/SquareSvg'
import TextSvg from '../../../../components/svgs/TextSvg'
import TriangleSvg from '../../../../components/svgs/TriangleSvg'
import { localDataState } from '../../../store'
import { whiteboardApp } from '../../../utils'
import styles from './style.module.scss'

export function GraphicOption() {
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
    },
    {
      type: 'eraser',
      icon: EraserSvg
    }
  ]

  const [currentType, setCurrentType] = useState<PlotType>('selection')

  whiteboardApp()?.watch.currentTypeChange((ty) => {
    setCurrentType(ty)
  })

  const changeCurrentType = (t: PlotType) => {
    if (t === currentType) {
      return
    }
    whiteboardApp().cancelActiveNode()
    setCurrentType(currentType)
    whiteboardApp().updateCurrentType(t)
  }

  const localData = useRecoilValue(localDataState) as LocalData

  return (
    <>
      <Collapsible
        keepDOM
        collapseHeight={40}
        isOpen={!localData.state.readonly}
        className={styles.group}
      >
        {Options.map((option, index) => (
          <Button
            key={index}
            type="primary"
            theme={currentType === option.type ? 'light' : 'borderless'}
            size="large"
            className={styles.option}
            icon={
              <option.icon
                width={20}
                height={20}
                fill={
                  currentType === option.type ? 'rgb(0,100,250)' : '#3d3d3d'
                }
              />
            }
            onClick={() => changeCurrentType(option.type)}
          />
        ))}
      </Collapsible>
    </>
  )
}
