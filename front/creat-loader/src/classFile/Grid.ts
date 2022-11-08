import Canvas from '../support/Canvas'
import { AppObject, Ctx } from '../types'

export default class Grid {
  public app: AppObject

  public canvas: any

  public ctx: Ctx | null

  constructor(app: AppObject) {
    this.app = app

    this.canvas = null

    this.ctx = null

    this.init()

    this.app.on('zoomChange', this.renderGrid, this)

    this.app.on('scrollChange', this.renderGrid, this)
  }

  // plot vertical lines
  renderVerticalLines() {
    const { calculate, width, state } = this.app
    const { gridConfig, scale } = state
    let maxRight = 0
    if (
      typeof gridConfig === 'undefined' ||
      typeof scale === 'undefined' ||
      typeof gridConfig.size === 'undefined'
    ) {
      // eslint-disable-next-line no-console
      console.error('gridConfig or scale or gridConfig.size is undefined')
      return
    }
    for (let i = -width / 2; i < width / 2; i += gridConfig.size) {
      this.plotVerticalLine(i)
      maxRight = i
    }
    // Draws the line beyond the left side when rolling to the right
    for (
      let i = -width / 2 - gridConfig.size;
      i > -calculate.subScrollX(width / scale / 2);
      i -= gridConfig.size
    ) {
      this.plotVerticalLine(i)
    }
    // Draws the line beyond the right when rolling to the left
    for (
      let i = maxRight + gridConfig.size;
      i < calculate.addScrollX(width / scale / 2);
      i += gridConfig.size
    ) {
      this.plotVerticalLine(i)
    }
  }

  // Rendering of horizontal lines
  renderHorizontalLines() {
    const { calculate, height, state } = this.app
    const { gridConfig, scale } = state
    if (
      typeof gridConfig === 'undefined' ||
      typeof scale === 'undefined' ||
      typeof gridConfig.size === 'undefined'
    ) {
      return
    }
    let maxBottom = 0
    for (let i = -height / 2; i < height / 2; i += gridConfig.size) {
      this.plotHorizontalLine(i)
      maxBottom = i
    }
    // Draws the line beyond the top when rolling downwards
    for (
      let i = -height / 2 - gridConfig.size;
      i > -calculate.subScrollY(height / scale / 2);
      i -= gridConfig.size
    ) {
      this.plotHorizontalLine(i)
    }
    // Draws the line beyond the bottom when rolling upwards
    for (
      let i = maxBottom + gridConfig.size;
      i < calculate.addScrollY(height / scale / 2);
      i += gridConfig.size
    ) {
      this.plotHorizontalLine(i)
    }
  }

  renderGrid() {
    this.canvas.clearCanvas()
    const { gridConfig, scale, showGrid } = this.app.state
    if (!showGrid) {
      return
    }
    if (
      this.ctx &&
      scale &&
      gridConfig &&
      this.ctx.strokeStyle &&
      this.ctx.lineWidth
    ) {
      this.ctx.save()
      this.ctx.scale(scale, scale)
      // @ts-ignore
      this.ctx.strokeStyle = gridConfig.strokeStyle
      // @ts-ignore
      this.ctx.lineWidth = gridConfig.lineWidth
    }

    this.renderVerticalLines()

    this.renderHorizontalLines()

    this.ctx?.restore()
  }

  // Drawing horizontal lines
  plotHorizontalLine(i: number) {
    const { calculate, width, state } = this.app
    if (typeof state.scale === 'undefined') {
      return
    }
    const _i = calculate.subScrollY(i)
    this.ctx?.beginPath()
    this.ctx?.moveTo(-width / state.scale / 2, _i)
    this.ctx?.lineTo(width / state.scale / 2, _i)
    this.ctx?.stroke()
  }

  // plot the reset line
  plotVerticalLine(i: number) {
    const { calculate, height, state } = this.app
    if (typeof state.scale === 'undefined') {
      return
    }
    const _i = calculate.subScrollX(i)
    this.ctx?.beginPath()
    this.ctx?.moveTo(_i, -height / state.scale / 2)
    this.ctx?.lineTo(_i, height / state.scale / 2)
    this.ctx?.stroke()
  }

  showGrid() {
    this.app.updateState({
      showGrid: true
    } as any)
    this.renderGrid()
  }

  hideGrid() {
    this.app.updateState({
      showGrid: false
    } as any)
    this.canvas.clearCanvas()
  }

  updateGrid(config = {}) {
    this.app.updateState({
      gridConfig: {
        ...this.app.state.gridConfig,
        ...config
      }
    } as any)
    if (this.app.state.showGrid) {
      this.hideGrid()
      this.showGrid()
    }
  }

  init() {
    if (this.canvas) {
      this.app.mountEL.removeChild(this.canvas.el)
    }
    const { width, height } = this.app
    this.canvas = new Canvas(width, height, {
      className: 'grid'
    })
    this.ctx = this.canvas.ctx
    this.app.mountEL.insertBefore(this.canvas.el, this.app.mountEL.children[0])
  }
}
