import { transformCoordinateOnNode } from '../common/utils'
import { checkIsAtRectangleEdge } from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotRect } from '../support/plot'
import { AppObject } from '../types'

export default class Rectangle extends BaseNode {
  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app)
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtRectangleEdge(this, rp)
  }

  render() {
    const { width, height }: any = this
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      plotRect(this.app.ctx, -halfWidth, -halfHeight, width, height, true)
    })
    this.renderDragNode()
  }
}
