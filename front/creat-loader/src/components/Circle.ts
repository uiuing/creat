import { transformCoordinateOnNode } from '../common/utils'
import {
  checkIsAtCircleEdge,
  getCircleRadius
} from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotCircle } from '../support/plot'
import { AppObject } from '../types'

export default class Circle extends BaseNode {
  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app, {
      lockRatio: true
    })
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtCircleEdge(this, rp)
  }

  render() {
    const { width, height }: any = this
    this.warpRender(() => {
      plotCircle(this.app.ctx, 0, 0, getCircleRadius(width, height), true)
    })
    this.renderDragNode()
  }
}
