import {
  getNodeCenterCoordinate,
  getRotatedCoordinate,
  transformCoordinateOnNode
} from '../common/utils'
import { checkIsAtTriangleEdge } from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotTriangle } from '../support/plot'
import { AppObject } from '../types'

export default class Triangle extends BaseNode {
  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app)
  }

  // Get a list of the end coordinates of the graph after the rotation has been applied
  getEndCoordinateList() {
    const { x, y, width, height, rotate }: any = this
    const coordinates = [
      [x + width / 2, y],
      [x + width, y + height],
      [x, y + height]
    ]
    const center = getNodeCenterCoordinate(this)
    return coordinates.map((coordinate) =>
      getRotatedCoordinate(
        coordinate[0],
        coordinate[1],
        center.x,
        center.y,
        rotate
      )
    )
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtTriangleEdge(this as any, rp)
  }

  render() {
    const { width, height }: any = this
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      plotTriangle(this.app.ctx, -halfWidth, -halfHeight, width, height, true)
    })
    this.renderDragNode()
  }
}
