import EventEmitter from 'eventemitter3'

import {
  createNodeKey,
  degToRad,
  getNodeFourCorners,
  getRotatedCoordinate
} from '../common/utils'
import { AppObject } from '../types'

export default class BaseNode extends EventEmitter {
  public app: AppObject

  public type: string

  public key: number

  public isCreate: boolean

  public isActive: boolean

  public isSelected: boolean

  public startX: number

  public startY: number

  x: number

  y: number

  width: number

  height: number

  public startRotate: number

  public rotate: number

  public noRender: boolean

  public style: any

  dragNode: any

  constructor(options: any, app: AppObject) {
    super()
    this.app = app
    // Type
    this.type = options.type || ''
    // key
    this.key = createNodeKey()
    // Is it being created
    this.isCreate = true
    // Activated or not
    this.isActive = true
    // Whether selected by multiple choice
    this.isSelected = false
    // Record initial position for use when dragging
    this.startX = 0
    this.startY = 0
    // Real-time position, which is the coordinate of the upper left corner of the graphic object
    this.x = options.x || 0
    this.y = options.y || 0
    // Width and height
    this.width = options.width || 0
    this.height = options.height || 0
    // Records the initial angle for use when rotating
    this.startRotate = 0
    // Angle
    this.rotate = options.rotate || 0
    // Does not need to be rendered
    this.noRender = false
    // style
    this.style = {
      strokeStyle: this.app.state.defaultColor,
      fillStyle: 'transparent',
      lineWidth: 2,
      lineDash: 0,
      globalAlpha: 1,
      ...(options.style || {})
    }
    // Example of dragging and dropping a graphic object
    this.dragNode = undefined
  }

  // Detects if a graphic object has been hit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isClick(x: number, y: number) {
    throw new Error('Subclasses need to implement this method!')
  }

  // Offsetting the angle of a graphic object
  offsetRotate(or: number) {
    this.updateRotate(this.startRotate + or)
    return this
  }

  // Setting the drawing style
  setStyle(style = {}) {
    const _style = style as any
    Object.keys(_style).forEach((key) => {
      if (key === 'lineDash') {
        if (_style.lineDash > 0) {
          this.app.ctx.setLineDash([_style.lineDash])
        }
      } else if (
        _style[key] !== undefined &&
        _style[key] !== '' &&
        _style[key] !== null
      ) {
        // @ts-ignore
        this.app.ctx[key] = _style[key]
      }
    })
    return this
  }

  // Public rendering operations
  warpRender(renderFn: any) {
    const { x, y, width, height, rotate, style } = this
    const { x: tx, y: ty } = this.app.calculate.transform(x, y)
    const halfWidth = width / 2
    const halfHeight = height / 2
    const cx = tx + halfWidth
    const cy = ty + halfHeight
    this.app.ctx.save()
    this.app.ctx.translate(cx, cy)
    this.app.ctx.rotate(degToRad(rotate))
    this.setStyle(style)
    renderFn({
      halfWidth,
      halfHeight,
      tx,
      ty,
      cx,
      cy
    })
    this.app.ctx.restore()
    return this
  }

  // Save the initial state of the graphic object
  saveState() {
    const { rotate, x, y } = this
    this.startRotate = rotate
    this.startX = x
    this.startY = y
    return this
  }

  // Moving graphic objects
  move(ox: number, oy: number) {
    const { startX, startY } = this
    this.x = startX + ox
    this.y = startY + oy
    this.emit('nodePositionChange', this.x, this.y)
    return this
  }

  // Updating the angle of a graphic object
  updateRotate(rotate: number) {
    rotate %= 360
    if (rotate < 0) {
      rotate = 360 + rotate
    }
    this.rotate = rotate
    this.app.emitNodeRotateChange(this.rotate)
  }

  // Rotate the individual coordinates of a graphic object according to the specified centre coordinates
  rotateByCenter(rotate: number, cx: number, cy: number) {
    this.offsetRotate(rotate)
    const np = getRotatedCoordinate(this.startX, this.startY, cx, cy, rotate)
    this.updatePos(np.x, np.y)
  }

  // Start adjusting graphic objects
  startResize(resizeType: string, e: any) {
    this.dragNode.startResize(resizeType, e)
    return this
  }

  // Ending the adjustment of graphic objects
  endResize() {
    this.dragNode.endResize()
    return this
  }

  // Adjustment in graphic objects
  resize(...args: any[]) {
    this.dragNode.handleResizeNode(...args)
    return this
  }

  // Get a list of the end coordinates of the graph after the rotation has been applied
  getEndCoordinateList() {
    return getNodeFourCorners(this as any)
  }

  // Update graphic object enclosures
  updateRect(x: number, y: number, width: number, height: number) {
    this.updatePos(x, y)
    this.updateSize(width, height)
    return this
  }

  // Update activation of graphic object sizes
  updateSize(width: number, height: number) {
    this.width = width
    this.height = height
    this.emit('nodeSizeChange', this.width, this.height)
    return this
  }

  // Update coordinates of active graphic objects
  updatePos(x: number, y: number) {
    this.x = x
    this.y = y
    this.emit('nodePositionChange', this.x, this.y)
    return this
  }

  // Serialisation
  serialize() {
    return {
      type: this.type,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      rotate: this.rotate,
      style: {
        ...this.style
      }
    }
  }

  // Rendering drag-and-drop graphic objects
  renderDragNode() {
    if (this.isActive && !this.isCreate) {
      this.dragNode.showAll()
      this.dragNode.render()
    } else if (this.isSelected) {
      // Selected by multiple choice
      this.dragNode.onlyShowBody()
      this.dragNode.render()
    }
  }

  // Rendering methods, which need to be implemented
  render() {
    throw new Error('Subclasses need to implement this method！')
  }
}
