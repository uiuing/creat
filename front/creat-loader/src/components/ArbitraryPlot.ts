import { transformCoordinateOnNode } from '../common/utils'
import { checkIsAtArbitraryPlotLineEdge } from '../common/utils/checkClick'
import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode'
import DragNode from '../support/DragNode'
import { plotArbitraryLine, plotLineSegment } from '../support/plot'
import { AppObject } from '../types'

export default class ArbitraryPlot extends BaseMultiplexCoordinateNode {
  public lastLineWidth: number

  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app)

    // The third number of the coordinates [x,y,speed] is the line width
    this.lastLineWidth = -1
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtArbitraryPlotLineEdge(this as any, rp)
  }

  // Rendering of a single line segment
  singleRender(
    mx: number,
    my: number,
    tx: number,
    ty: number,
    lineWidth: number | undefined
  ) {
    this.app.ctx.save()
    plotLineSegment(this.app.ctx, mx, my, tx, ty, lineWidth)
    this.app.ctx.restore()
  }

  render() {
    const { coordinateArr }: any = this
    this.warpRender(({ cx, cy }: any) => {
      plotArbitraryLine(this.app.ctx, coordinateArr, {
        app: this.app,
        cx,
        cy
      })
    })
    this.renderDragNode()
  }
}
