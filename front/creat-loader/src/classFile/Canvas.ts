import { createCanvas } from '../common/utils'

export default class Canvas {
  private width: number

  private height: number

  private el: HTMLCanvasElement

  private context: CanvasRenderingContext2D | null

  constructor(
    width: number,
    height: number,
    option: { noStyle: boolean; noTranslate: boolean; className: string }
  ) {
    this.width = width
    this.height = height
    const { canvas, context } = createCanvas(width, height, option)
    this.el = canvas
    this.context = context
  }

  clearCanvas() {
    const { width, height } = this
    this.context?.clearRect(-width / 2, -height / 2, width, height)
  }
}
