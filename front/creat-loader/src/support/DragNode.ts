import { DRAG_NODE_PARTS, FOUR_CORNER } from '../common/constants'
import {
  checkCoordinateIsInRectangle,
  getNodeCenterCoordinate,
  getNodeRotatedFourCornerCoordinate,
  getRotatedCoordinate,
  getTowCoordinateDistance,
  getTowCoordinateRotate,
  transformCoordinateOnNode,
  transformCoordinateReverseRotate
} from '../common/utils'
import { AppObject, Node } from '../types'
import BaseNode from './BaseNode'
import { plotCircle, plotRect } from './plot'

export default class DragNode extends BaseNode {
  public options: Node

  public node: any

  public offset: number

  public size: number

  public resizeType: string

  public diagonalCoordinate: { x: number; y: number }

  public mousedownPosAndNodePosOffset: { x: number; y: number }

  public nodeRatio: number

  public hideParts: any[]

  constructor(node: any, app: AppObject, options = {}) {
    super(
      {
        type: 'dragNode',
        notNeedDragNode: true
      },
      app
    )

    // @ts-ignore
    this.options = {
      lockRatio: false,
      ...options
    }

    this.style = {
      strokeStyle: '#666',
      fillStyle: 'transparent',
      lineWidth: 'small',
      lineDash: 0,
      globalAlpha: 1
    }

    // Attribution Nodes
    this.node = node

    // Distance to graphic objects
    this.offset = 5

    // Drag handle size
    this.size = 10

    // What adjustment operation is currently in progress
    this.resizeType = ''

    // Diagonal coordinates of the coordinates of the graphical object currently dragged with the mouse held down
    this.diagonalCoordinate = {
      x: 0,
      y: 0
    }

    // The difference between the coordinates of the current mouse press and the coordinates of the dragged graphic object
    this.mousedownPosAndNodePosOffset = {
      x: 0,
      y: 0
    }

    // Aspect ratio of graphical objects
    this.nodeRatio = 0

    // The hidden part
    this.hideParts = []

    this.x = 0
    this.y = 0
  }

  // Start adjusting graphic objects
  // @ts-ignore
  startResize(resizeType: string, e: any) {
    this.resizeType = resizeType
    if (this.options.lockRatio) {
      this.nodeRatio = this.node.width / this.node.height
    }
    if (resizeType === DRAG_NODE_PARTS.BODY) {
      this.node.saveState()
    } else if (resizeType === DRAG_NODE_PARTS.ROTATE) {
      this.node.saveState()
    } else if (resizeType === DRAG_NODE_PARTS.TOP_LEFT_BUTTON) {
      this.handleDragMousedown(e, FOUR_CORNER.TOP_LEFT)
    } else if (resizeType === DRAG_NODE_PARTS.TOP_RIGHT_BUTTON) {
      this.handleDragMousedown(e, FOUR_CORNER.TOP_RIGHT)
    } else if (resizeType === DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON) {
      this.handleDragMousedown(e, FOUR_CORNER.BOTTOM_RIGHT)
    } else if (resizeType === DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON) {
      this.handleDragMousedown(e, FOUR_CORNER.BOTTOM_LEFT)
    }
  }

  // Ending the adjustment of graphic objects
  // @ts-ignore
  endResize() {
    this.resizeType = ''
    this.diagonalCoordinate = {
      x: 0,
      y: 0
    }
    this.mousedownPosAndNodePosOffset = {
      x: 0,
      y: 0
    }
    this.nodeRatio = 0
  }

  // Handling of four retractable handle events for dragging graphic objects by pressing
  handleDragMousedown(e: { clientX: number; clientY: number }, corner: string) {
    const centerPos = getNodeCenterCoordinate(this.node)
    const pos: any = getNodeRotatedFourCornerCoordinate(this.node, corner)
    this.diagonalCoordinate.x = 2 * centerPos.x - pos.x
    this.diagonalCoordinate.y = 2 * centerPos.y - pos.y
    this.mousedownPosAndNodePosOffset.x = e.clientX - pos.x
    this.mousedownPosAndNodePosOffset.y = e.clientY - pos.y
    this.node.saveState()
  }

  // Adjusting graphic objects
  handleResizeNode(
    e: any,
    mx: number,
    my: number,
    offsetX: number,
    offsetY: number
  ) {
    const { resizeType } = this
    if (resizeType === DRAG_NODE_PARTS.BODY) {
      this.handleMoveNode(offsetX, offsetY)
    } else if (resizeType === DRAG_NODE_PARTS.ROTATE) {
      this.handleRotateNode(e, mx, my)
    } else if (resizeType === DRAG_NODE_PARTS.TOP_LEFT_BUTTON) {
      this.handleStretchNode(
        e,
        (
          newCenter: { x: number; y: number },
          rp: { x: number; y: number }
        ) => ({
          width: (newCenter.x - rp.x) * 2,
          height: (newCenter.y - rp.y) * 2
        }),
        (rp: { x: any; y: any }) => ({
          x: rp.x,
          y: rp.y
        }),
        (
          newRatio: number,
          newRect: { x?: any; width?: any; height?: any; y?: any }
        ) => {
          let { x } = newRect
          let { y } = newRect
          if (newRatio > this.nodeRatio) {
            x = newRect.x + newRect.width - this.nodeRatio * newRect.height
          } else if (newRatio < this.nodeRatio) {
            y = newRect.y + (newRect.height - newRect.width / this.nodeRatio)
          }
          return {
            x,
            y
          }
        }
      )
    } else if (resizeType === DRAG_NODE_PARTS.TOP_RIGHT_BUTTON) {
      this.handleStretchNode(
        e,
        (
          newCenter: { x: number; y: number },
          rp: { x: number; y: number }
        ) => ({
          width: (rp.x - newCenter.x) * 2,
          height: (newCenter.y - rp.y) * 2
        }),
        (rp: { x: number; y: any }, newSize: { width: number }) => ({
          x: rp.x - newSize.width,
          y: rp.y
        }),
        (
          newRatio: number,
          newRect: { x?: any; height?: any; width?: any; y?: any }
        ) => {
          let { x } = newRect
          let { y } = newRect
          if (newRatio > this.nodeRatio) {
            x = newRect.x + this.nodeRatio * newRect.height
          } else if (newRatio < this.nodeRatio) {
            x = newRect.x + newRect.width
            y = newRect.y + (newRect.height - newRect.width / this.nodeRatio)
          }
          return {
            x,
            y
          }
        }
      )
    } else if (resizeType === DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON) {
      this.handleStretchNode(
        e,
        (
          newCenter: { x: number; y: number },
          rp: { x: number; y: number }
        ) => ({
          width: (rp.x - newCenter.x) * 2,
          height: (rp.y - newCenter.y) * 2
        }),
        (
          rp: { x: number; y: number },
          newSize: { width: number; height: number }
        ) => ({
          x: rp.x - newSize.width,
          y: rp.y - newSize.height
        }),
        (
          newRatio: number,
          newRect: { x?: any; height?: any; y?: any; width?: any }
        ) => {
          let { x } = newRect
          let { y } = newRect
          if (newRatio > this.nodeRatio) {
            x = newRect.x + this.nodeRatio * newRect.height
            y = newRect.y + newRect.height
          } else if (newRatio < this.nodeRatio) {
            x = newRect.x + newRect.width
            y = newRect.y + newRect.width / this.nodeRatio
          }
          return {
            x,
            y
          }
        }
      )
    } else if (resizeType === DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON) {
      this.handleStretchNode(
        e,
        (
          newCenter: { x: number; y: number },
          rp: { x: number; y: number }
        ) => ({
          width: (newCenter.x - rp.x) * 2,
          height: (rp.y - newCenter.y) * 2
        }),
        (rp: { x: number; y: number }, newSize: { height: number }) => ({
          x: rp.x,
          y: rp.y - newSize.height
        }),
        (
          newRatio: number,
          newRect: { x?: any; width?: any; height?: any; y?: any }
        ) => {
          let { x } = newRect
          let { y } = newRect
          if (newRatio > this.nodeRatio) {
            x = newRect.x + newRect.width - this.nodeRatio * newRect.height
            y = newRect.y + newRect.height
          } else if (newRatio < this.nodeRatio) {
            y = newRect.y + newRect.width / this.nodeRatio
          }
          return {
            x,
            y
          }
        }
      )
    }
  }

  // Move the graphic object as a whole
  handleMoveNode(offsetX: number, offsetY: number) {
    this.node.move(offsetX, offsetY)
  }

  // Rotating graphic objects
  handleRotateNode(
    e: { clientX: number; clientY: number },
    mx: number,
    my: number
  ) {
    const centerPos = getNodeCenterCoordinate(this.node)
    const rotate = getTowCoordinateRotate(
      centerPos.x,
      centerPos.y,
      e.clientX,
      e.clientY,
      mx,
      my
    )
    this.node.offsetRotate(rotate)
  }

  // Set the hidden section
  setHideParts(parts = []) {
    this.hideParts = parts
  }

  // Show all sections
  showAll() {
    this.setHideParts([])
  }

  // Only the main part is displayed
  onlyShowBody() {
    this.setHideParts([
      DRAG_NODE_PARTS.ROTATE,
      DRAG_NODE_PARTS.TOP_LEFT_BUTTON,
      DRAG_NODE_PARTS.TOP_RIGHT_BUTTON,
      DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON,
      DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON
    ] as any)
  }

  // Update data
  update() {
    this.x = this.node.x - this.offset
    this.y = this.node.y - this.offset
    this.width = this.node.width + this.offset * 2
    this.height = this.node.height + this.offset * 2
    this.rotate = this.node.rotate
  }

  // Scaling calculations
  stretchCalc(
    x: number,
    y: number,
    calcSize: (
      arg0: { x: number; y: number },
      arg1: { x: number; y: number }
    ) => any,
    calcPos: (arg0: { x: number; y: number }, arg1: any) => any
  ) {
    const newCenter = {
      x: (x + this.diagonalCoordinate.x) / 2,
      y: (y + this.diagonalCoordinate.y) / 2
    }
    const rp = transformCoordinateReverseRotate(
      x,
      y,
      newCenter.x,
      newCenter.y,
      this.node.rotate
    )
    const newSize = calcSize(newCenter, rp)
    let isWidthReverse = false
    if (newSize.width < 0) {
      newSize.width = 0
      isWidthReverse = true
    }
    let isHeightReverse = false
    if (newSize.height < 0) {
      newSize.height = 0
      isHeightReverse = true
    }
    const newPos = calcPos(rp, newSize)
    const newRect = {
      x: newPos.x,
      y: newPos.y,
      width: newSize.width,
      height: newSize.height
    }
    if (isWidthReverse || isHeightReverse) {
      newRect.x = this.node.x
      newRect.y = this.node.y
    }
    return {
      newRect,
      newCenter
    }
  }

  // Stretching graphic objects
  handleStretchNode(
    e: { clientX: number; clientY: number },
    calcSize: any,
    calcPos: any,
    fixPos: any
  ) {
    const actClientX = e.clientX - this.mousedownPosAndNodePosOffset.x
    const actClientY = e.clientY - this.mousedownPosAndNodePosOffset.y
    const { newRect, newCenter } = this.stretchCalc(
      actClientX,
      actClientY,
      calcSize,
      calcPos
    )
    if (this.options.lockRatio) {
      this.fixStretch(newRect, newCenter, calcSize, calcPos, fixPos)
      return
    }
    this.node.updateRect(newRect.x, newRect.y, newRect.width, newRect.height)
  }

  // Correction of new graphics when aspect ratio is locked
  fixStretch(
    newRect: { x?: any; y?: any; width: any; height: any },
    newCenter: { x: any; y: any },
    calcSize: {
      (newCenter: { x: number; y: number }, rp: { x: number; y: number }): {
        width: number
        height: number
      }
      (newCenter: { x: number; y: number }, rp: { x: number; y: number }): {
        width: number
        height: number
      }
      (newCenter: { x: number; y: number }, rp: { x: number; y: number }): {
        width: number
        height: number
      }
      (newCenter: { x: number; y: number }, rp: { x: number; y: number }): {
        width: number
        height: number
      }
      (arg0: { x: number; y: number }, arg1: { x: number; y: number }): any
      (arg0: { x: number; y: number }, arg1: { x: number; y: number }): any
    },
    calcPos: {
      (rp: { x: any; y: any }): { x: any; y: any }
      (rp: { x: number; y: any }, newSize: { width: number }): {
        x: number
        y: any
      }
      (
        rp: { x: number; y: number },
        newSize: { width: number; height: number }
      ): { x: number; y: number }
      (rp: { x: number; y: number }, newSize: { height: number }): {
        x: number
        y: number
      }
      (arg0: { x: number; y: number }, arg1: any): any
      (arg0: { x: number; y: number }, arg1: any): any
    },
    fixPos: {
      (
        newRatio: number,
        newRect: { x?: any; width?: any; height?: any; y?: any }
      ): { x: any; y: any }
      (
        newRatio: number,
        newRect: { x?: any; height?: any; width?: any; y?: any }
      ): { x: any; y: any }
      (
        newRatio: number,
        newRect: { x?: any; height?: any; y?: any; width?: any }
      ): { x: any; y: any }
      (
        newRatio: number,
        newRect: { x?: any; width?: any; height?: any; y?: any }
      ): { x: any; y: any }
      (arg0: number, arg1: any): any
    }
  ) {
    const newRatio = newRect.width / newRect.height
    const fp = fixPos(newRatio, newRect)
    const rp = getRotatedCoordinate(
      fp.x,
      fp.y,
      newCenter.x,
      newCenter.y,
      this.node.rotate
    )
    const fixNewRect = this.stretchCalc(rp.x, rp.y, calcSize, calcPos).newRect
    if (fixNewRect.width === 0 && fixNewRect.height === 0) {
      return
    }
    this.node.updateRect(
      fixNewRect.x,
      fixNewRect.y,
      fixNewRect.width,
      fixNewRect.height
    )
  }

  render() {
    this.update()
    const { width, height } = this
    this.warpRender(({ halfWidth, halfHeight }: any) => {
      this.app.ctx.save()
      if (!this.hideParts.includes(DRAG_NODE_PARTS.BODY)) {
        this.app.ctx.setLineDash([5])
        plotRect(this.app.ctx, -halfWidth, -halfHeight, width, height)
        this.app.ctx.restore()
      }
      if (!this.hideParts.includes(DRAG_NODE_PARTS.TOP_LEFT_BUTTON)) {
        plotRect(
          this.app.ctx,
          -halfWidth - this.size,
          -halfHeight - this.size,
          this.size,
          this.size
        )
      }
      if (!this.hideParts.includes(DRAG_NODE_PARTS.TOP_RIGHT_BUTTON)) {
        plotRect(
          this.app.ctx,
          -halfWidth + this.node.width + this.size,
          -halfHeight - this.size,
          this.size,
          this.size
        )
      }
      if (!this.hideParts.includes(DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON)) {
        plotRect(
          this.app.ctx,
          -halfWidth + this.node.width + this.size,
          -halfHeight + this.node.height + this.size,
          this.size,
          this.size
        )
      }
      if (!this.hideParts.includes(DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON)) {
        plotRect(
          this.app.ctx,
          -halfWidth - this.size,
          -halfHeight + this.node.height + this.size,
          this.size,
          this.size
        )
      }
      if (!this.hideParts.includes(DRAG_NODE_PARTS.ROTATE)) {
        plotCircle(
          this.app.ctx,
          -halfWidth + this.node.width / 2 + this.size / 2,
          -halfHeight - this.size * 2,
          this.size
        )
      }
    })
  }

  // Detects which part of a dragged graphic object a coordinate is on
  checkCoordinateInDragNodeWhere(x: number, y: number) {
    let part = ''
    const rp = transformCoordinateOnNode(x, y, this.node)
    if (checkCoordinateIsInRectangle(rp.x, rp.y, this as any)) {
      part = DRAG_NODE_PARTS.BODY
    } else if (
      getTowCoordinateDistance(
        rp.x,
        rp.y,
        this.x + this.width / 2,
        this.y - this.size * 2
      ) <= this.size
    ) {
      part = DRAG_NODE_PARTS.ROTATE
    } else if (
      this._checkCoordinateIsInButton(rp.x, rp.y, FOUR_CORNER.TOP_LEFT)
    ) {
      part = DRAG_NODE_PARTS.TOP_LEFT_BUTTON
    } else if (
      this._checkCoordinateIsInButton(rp.x, rp.y, FOUR_CORNER.TOP_RIGHT)
    ) {
      part = DRAG_NODE_PARTS.TOP_RIGHT_BUTTON
    } else if (
      this._checkCoordinateIsInButton(rp.x, rp.y, FOUR_CORNER.BOTTOM_RIGHT)
    ) {
      part = DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON
    } else if (
      this._checkCoordinateIsInButton(rp.x, rp.y, FOUR_CORNER.BOTTOM_LEFT)
    ) {
      part = DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON
    }
    if (this.hideParts.includes(part)) {
      part = ''
    }
    return part
  }

  // Detects if the coordinates are within a drag and drop button
  _checkCoordinateIsInButton(x: number, y: number, dir: string) {
    let _x = 0
    let _y = 0
    switch (dir) {
      case FOUR_CORNER.TOP_LEFT:
        _x = this.x - this.size
        _y = this.y - this.size
        break
      case FOUR_CORNER.TOP_RIGHT:
        _x = this.x + this.width
        _y = this.y - this.size
        break
      case FOUR_CORNER.BOTTOM_RIGHT:
        _x = this.x + this.width
        _y = this.y + this.height
        break
      case FOUR_CORNER.BOTTOM_LEFT:
        _x = this.x - this.size
        _y = this.y + this.height
        break
      default:
        break
    }
    return checkCoordinateIsInRectangle(x, y, _x, _y, this.size, this.size)
  }
}
