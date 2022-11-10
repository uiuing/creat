import { createCanvas } from '../common/utils'
import { Ctx } from '../types'

export default class Canvas {
  public width: number

  public height: number

  public el: HTMLCanvasElement | undefined

  public ctx: Ctx | undefined

  constructor(
    width: number,
    height: number,
    opt?: { noStyle?: boolean; noTranslate?: boolean; className?: string }
  ) {
    this.width = width
    this.height = height
    const { canvas, ctx } = createCanvas(width, height, opt)
    if (ctx) {
      this.el = canvas
      this.ctx = ctx
    }
  }

  clearCanvas() {
    const { width, height } = this
    this.ctx?.clearRect(-width / 2, -height / 2, width, height)
  }
}
