import EventEmitter from 'eventemitter3'

import { getTowCoordinateDistance } from '../common/utils'
import { AppObject } from '../types'

export default class Event extends EventEmitter {
  public app: AppObject

  public calculate: any

  public lastMousePos: { x: number; y: number }

  public mouseDistance: number

  public lastMouseTime: number

  public mouseDuration: number

  public mouseSpeed: number

  public isMousedown: boolean

  public mousedownPos: {
    originClientY: number
    x: number
    y: number
    unGridClientX: number
    unGridClientY: number
    originClientX: number
  }

  public mouseOffset: {
    originX: number
    originY: number
    x: number
    y: number
  }

  constructor(app: AppObject) {
    super()
    this.app = app
    this.calculate = app.calculate

    // Record the mouse position at the previous moment
    this.lastMousePos = {
      x: 0,
      y: 0
    }

    // Distance of mouse movement in the previous instant
    this.mouseDistance = 0

    // Record the time of the previous moment
    this.lastMouseTime = Date.now()

    // The moment before
    this.mouseDuration = 0

    // Mouse movement speed in the previous instant
    this.mouseSpeed = 0

    // Is the mouse pressed
    this.isMousedown = false

    // Mouse position when pressed
    this.mousedownPos = {
      x: 0,
      y: 0,
      unGridClientX: 0,
      unGridClientY: 0,
      originClientX: 0,
      originClientY: 0
    }

    // The difference between the current position of the mouse and the position when it is pressed
    this.mouseOffset = {
      x: 0,
      y: 0,
      originX: 0,
      originY: 0
    }

    this.onMousedown = this.onMousedown.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
    this.onMouseup = this.onMouseup.bind(this)
    this.onDblclick = this.onDblclick.bind(this)
    this.onMousewheel = this.onMousewheel.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
    this.onKeyup = this.onKeyup.bind(this)
    this.onContextmenu = this.onContextmenu.bind(this)
    this.bindEvent()
  }

  onMouseup(e: any) {
    e = this.transformEvent(e)
    this.isMousedown = false
    this.mousedownPos.x = 0
    this.mousedownPos.y = 0
    this.emit('mouseup', e, this)
  }

  onDblclick(e: any) {
    e = this.transformEvent(e)
    this.emit('dblclick', e, this)
  }

  onMousewheel(e: any) {
    e = this.transformEvent(e)
    this.emit('mousewheel', e.originEvent.wheelDelta < 0 ? 'down' : 'up')
  }

  onContextmenu(e: any) {
    e.stopPropagation()
    e.preventDefault()
    e = this.transformEvent(e)
    this.emit('contextmenu', e, this)
  }

  onKeydown(e: any) {
    this.emit('keydown', e, this)
  }

  onKeyup(e: any) {
    this.emit('keyup', e, this)
  }

  onMousedown(e: any) {
    e = this.transformEvent(e)
    this.isMousedown = true
    this.mousedownPos.x = e.clientX
    this.mousedownPos.y = e.clientY
    this.mousedownPos.unGridClientX = e.unGridClientX
    this.mousedownPos.unGridClientY = e.unGridClientY
    this.mousedownPos.originClientX = e.originEvent.clientX
    this.mousedownPos.originClientY = e.originEvent.clientY
    this.emit('mousedown', e, this)
  }

  onMousemove(e: any) {
    e = this.transformEvent(e)
    const x = e.clientX
    const y = e.clientY
    if (this.isMousedown) {
      this.mouseOffset.x = x - this.mousedownPos.x
      this.mouseOffset.y = y - this.mousedownPos.y
      this.mouseOffset.originX =
        e.originEvent.clientX - this.mousedownPos.originClientX
      this.mouseOffset.originY =
        e.originEvent.clientY - this.mousedownPos.originClientY
    }
    const curTime = Date.now()
    this.mouseDuration = curTime - this.lastMouseTime
    this.mouseDistance = getTowCoordinateDistance(
      x,
      y,
      this.lastMousePos.x,
      this.lastMousePos.y
    )
    this.mouseSpeed = this.mouseDistance / this.mouseDuration
    this.emit('mousemove', e, this)
    this.lastMouseTime = curTime
    this.lastMousePos.x = x
    this.lastMousePos.y = y
  }

  // events into coordinates, and adsorption if grid is turned on
  transformEvent(e: { clientX: any; clientY: any }) {
    const { calculate } = this.app
    const wp = calculate.windowToContainer(e.clientX, e.clientY)
    let { x, y } = calculate.reverseScale(wp.x, wp.y)
    x = calculate.addScrollX(x)
    y = calculate.addScrollY(y)
    const unGridClientX = x
    const unGridClientY = y
    const gp = calculate.gridAdsorbent(x, y)
    return {
      originEvent: e,
      unGridClientX,
      unGridClientY,
      clientX: gp.x,
      clientY: gp.y
    }
  }

  bindEvent() {
    this.app.mountEL.addEventListener('mousedown', this.onMousedown)
    this.app.mountEL.addEventListener('mousemove', this.onMousemove)
    this.app.mountEL.addEventListener('mouseup', this.onMouseup)
    this.app.mountEL.addEventListener('dblclick', this.onDblclick)
    this.app.mountEL.addEventListener('mousewheel', this.onMousewheel)
    this.app.mountEL.addEventListener('contextmenu', this.onContextmenu)
    window.addEventListener('keydown', this.onKeydown)
    window.addEventListener('keyup', this.onKeyup)
  }

  unbindEvent() {
    this.app.mountEL.removeEventListener('mousedown', this.onMousedown)
    this.app.mountEL.removeEventListener('mousemove', this.onMousemove)
    this.app.mountEL.removeEventListener('mouseup', this.onMouseup)
    this.app.mountEL.removeEventListener('dblclick', this.onDblclick)
    this.app.mountEL.removeEventListener('mousewheel', this.onMousewheel)
    this.app.mountEL.removeEventListener('contextmenu', this.onContextmenu)
    window.removeEventListener('keydown', this.onKeydown)
    window.removeEventListener('keyup', this.onKeyup)
  }
}
