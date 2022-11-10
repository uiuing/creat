import { AppObject, Ctx } from '../types'

export default class Background {
  public app: AppObject

  constructor(app: AppObject) {
    this.app = app
  }

  // Setting the background
  set() {
    if (this.app.state.backgroundColor) {
      this.addBackgroundColor()
    } else {
      this.remove()
    }
  }

  // Add background colour
  addBackgroundColor() {
    this.app.mountEL.style.backgroundColor = <string>(
      this.app.state.backgroundColor
    )
  }

  // Remove background colour
  remove() {
    this.app.mountEL.style.backgroundColor = ''
  }

  // Set background colour inside canvas, not css style
  static canvasAddBackgroundColor(
    ctx: Ctx,
    width: number,
    height: number,
    backgroundColor: string
  ) {
    ctx.save()
    ctx.rect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fill()
    ctx.restore()
  }
}
