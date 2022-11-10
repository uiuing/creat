import { transformCoordinateOnNode } from '../common/utils'
import { checkIsAtRectangleInner } from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotImage } from '../support/plot'
import { AppObject } from '../types'

export default class Image extends BaseNode {
  public url: string

  public imageObj: null

  public ratio: number

  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app, {
      lockRatio: true
    })

    const { url, imageObj, ratio }: any = options

    this.url = url || ''

    this.imageObj = imageObj || null

    this.ratio = ratio || 1
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtRectangleInner(this, rp)
  }

  // Serialisation
  serialize() {
    const base = super.serialize()
    return {
      ...base,
      url: this.url,
      ratio: this.ratio
    }
  }

  render() {
    const { width, height }: any = this
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      plotImage(this.app.ctx, this, -halfWidth, -halfHeight, width, height)
    })
    this.renderDragNode()
  }
}
