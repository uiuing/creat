import { transformCoordinateOnNode } from '../common/utils'
import { checkIsAtLineEdge } from '../common/utils/checkClick'
import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode'
import DragNode from '../support/DragNode'
import { plotLine } from '../support/plot'
import { AppObject } from '../types'

export default class Line extends BaseMultiplexCoordinateNode {
  public isSingle: boolean

  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app)

    // Is it a single line segment, otherwise it is a folded line consisting of multiple line segments
    const { isSingle = false }: any = options

    this.isSingle = isSingle
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtLineEdge(this as any, rp)
  }

  render() {
    const { coordinateArr, fictitiousCoordinate }: any = this
    this.warpRender(({ cx, cy }: any) => {
      // Plus the current live position of the mouse
      let realtimeCoordinate: any[][] = []
      if (coordinateArr.length > 0 && this.isCreate) {
        const { x: fx, y: fy } = this.app.calculate.transform(
          fictitiousCoordinate.x - cx,
          fictitiousCoordinate.y - cy
        )
        realtimeCoordinate = [[fx, fy]]
      }
      plotLine(
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
