import { splitTextLines, transformCoordinateOnNode } from '../common/utils'
import { checkIsAtRectangleInner } from '../common/utils/checkClick'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { plotText } from '../support/plot'
import { AppObject, Node } from '../types'

export default class Text extends BaseNode {
  public text: string

  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this, this.app, {
      lockRatio: true
    })

    this.text = options?.text || ''

    this.style.fillStyle = options?.style?.fillStyle || '#000000'

    this.style.fontSize = options?.style?.fontSize || 18

    this.style.lineHeightRatio = options?.style?.lineHeightRatio || 1.5

    this.style.fontFamily =
      options?.style?.fontFamily || 'Microsoft YaHei, sans-serif'
  }

  isClick(x: number, y: number) {
    const rp = transformCoordinateOnNode(x, y, this)
    return checkIsAtRectangleInner(this, rp)
  }

  // Update the wrap-around box
  // @ts-ignore
  updateRect(x: number, y: number, width: number, height: number) {
    const { text, style } = this
    this.style.fontSize = Math.floor(
      height / splitTextLines(text).length / style.lineHeightRatio
    )
    super.updateRect(x, y, width, height)
  }

  serialize() {
    const base = super.serialize()
    return {
      ...base,
      text: this.text
    }
  }

  render() {
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      plotText(this.app.ctx, this, -halfWidth, -halfHeight)
    })
    this.renderDragNode()
  }
}
