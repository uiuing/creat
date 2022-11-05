import {
  getNodeCenterCoordinate,
  getRotatedCoordinate,
  transformCoordinateOnNode
} from '../common/utils'
import { checkIsAtDiamondEdge } from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotDiamond } from '../support/plot'
import { AppObject } from '../types'

export default class Diamond extends BaseNode {
  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app)
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtDiamondEdge(this, rp)
  }

  // Get a list of the end coordinates of the graph after the rotation has been applied
  getEndCoordinateList() {
    const { x, y, width, height, rotate }: any = this
    const coordinates = [
      [x + width / 2, y],
      [x + width, y + height / 2],
      [x + width / 2, y + height],
      [x, y + height / 2]
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

  render() {
    const { width, height }: any = this
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      plotDiamond(this.app.ctx, -halfWidth, -halfHeight, width, height, true)
    })
    this.renderDragNode()
  }
}
