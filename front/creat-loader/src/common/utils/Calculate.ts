import { AppObject } from '../../types'

export default class Calculate {
  private readonly app: AppObject

  constructor(app: AppObject) {
    this.app = app
  }

  // Conversion of screen coordinates to canvas coordinates
  transformToCanvasCalculate(x: number, y: number) {
    x -= this.app.width / 2
    y -= this.app.height / 2
    return {
      x,
      y
    }
  }

  // Object position attached to grid
  gridAdsorbent(x: number, y: number) {
    const { gridConfig, showGrid } = this.app.state
    if (typeof gridConfig === 'undefined') {
      return {}
    }
    if (!showGrid) {
      return {
        x,
        y
      }
    }
    const gridSize = gridConfig.size
    if (typeof gridSize === 'undefined') {
      return {}
    }
    return {
      x: x - (x % gridSize),
      y: y - (y % gridSize)
    }
  }

  // Add vertical scroll distance
  addScrollY(y: number) {
    if (typeof this.app.state.scrollY === 'undefined') {
      return 0
    }
    return this.app.state.scrollY + y
  }

  // Add horizontal scroll distance
  addScrollX(x: number) {
    if (typeof this.app.state.scrollX === 'undefined') {
      return 0
    }
    return this.app.state.scrollX + x
  }

  // minus vertical scroll distance
  subScrollY(y: number) {
    if (typeof this.app.state.scrollY === 'undefined') {
      return 0
    }
    return y - this.app.state.scrollY
  }

  // minus horizontal rolling distance
  subScrollX(x: number) {
    if (typeof this.app.state.scrollX === 'undefined') {
      return 0
    }
    return x - this.app.state.scrollX
  }

  // Canvas conversion to screen coordinates
  transformToScreenCalculate(x: number, y: number) {
    x += this.app.width / 2
    y += this.app.height / 2
    return {
      x,
      y
    }
  }

  // Integrated conversion, screen coordinates to canvas coordinates minus scroll values
  transform(x: number, y: number) {
    const t = this.transformToCanvasCalculate(x, y)
    return {
      x: this.subScrollX(t.x),
      y: this.subScrollY(t.y)
    }
  }

  // For when the container is not full screen, convert coordinates relative to the container to relative to the window
  mountELToWindow(x: number, y: number) {
    return {
      x: x + this.app.left,
      y: y + this.app.top
    }
  }

  // For when the container is not full screen, Convert coordinates relative to the window to relative to the container
  windowToContainer(x: number, y: number) {
    return {
      x: x - this.app.left,
      y: y - this.app.top
    }
  }

  // The position of the screen coordinates after applying canvas scaling
  scale(x: number, y: number) {
    const { state } = this.app
    if (typeof state.scale === 'undefined') {
      return {}
    }
    const wp = this.transformToCanvasCalculate(x, y)
    const sp = this.transformToScreenCalculate(
      wp.x * state.scale,
      wp.y * state.scale
    )
    return {
      x: sp.x,
      y: sp.y
    }
  }

  // The position of the screen coordinates after applying the canvas zoom in reverse
  reverseScale(x: number, y: number) {
    const { state } = this.app
    if (typeof state.scale === 'undefined') {
      return {}
    }
    const tp = this.transformToCanvasCalculate(x, y)
    const sp = this.transformToScreenCalculate(
      tp.x / state.scale,
      tp.y / state.scale
    )
    return {
      x: sp.x,
      y: sp.y
    }
  }
}
