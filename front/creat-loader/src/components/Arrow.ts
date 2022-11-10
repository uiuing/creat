import { transformCoordinateOnNode } from '../common/utils'
import { checkIsAtArrowEdge } from '../common/utils/checkClick'
import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode'
import DragNode from '../support/DragNode'
import { plotArrow } from '../support/plot'
import { AppObject } from '../types'

export default class Arrow extends BaseMultiplexCoordinateNode {
  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, app)
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtArrowEdge(this, rp)
  }

  render() {
    const { coordinateArr, fictitiousCoordinate }: any = this
    this.warpRender(({ cx, cy }: { cx: number; cy: number }) => {
      // Plus the current live position of the mouse
      let realtimeCoordinate: any[][] = []
      if (coordinateArr.length > 0 && this.isCreate) {
        const { x: fx, y: fy } = this.app.calculate.transform(
          fictitiousCoordinate.x - cx,
          fictitiousCoordinate.y - cy
        )
        realtimeCoordinate = [[fx, fy]]
      }
      plotArrow(
        this.app.ctx,
        coordinateArr
          .map((coordinate: any[]) => {
            const { x, y } = this.app.calculate.transform(
              coordinate[0],
              coordinate[1]
            )
            return [x - cx, y - cy]
          })
          .concat(realtimeCoordinate)
      )
    })
    this.renderDragNode()
  }
}
