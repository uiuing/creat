import {
  deepCopy,
  getBoundingRect,
  getNodeCenterCoordinate,
  getRotatedCoordinate
} from '../common/utils'
import { AppObject } from '../types'
import BaseNode from './BaseNode'

export default class BaseMultiplexCoordinateNode extends BaseNode {
  public startCoordinateArr: any[]

  public coordinateArr: any

  public startWidth: number | undefined

  public startHeight: number | undefined

  public fictitiousCoordinate: { x: number; y: number }

  constructor(opts: any, app: AppObject) {
    super(opts, app)
    // Record initial coordinates when dragging
    this.startCoordinateArr = []
    // Coordinates
    this.coordinateArr = opts.coordinateArr || []
    // Record initial size for use when scaling
    this.startWidth = 0
    this.startHeight = 0
    // The current live position of the mouse, used to display the virtual line from the last coordinate of the line segment to the current mouse when drawing
    this.fictitiousCoordinate = {
      x: 0,
      y: 0
    }
  }

  // Update graphic object enclosures
  updateRect(x: number, y: number, width: number, height: number) {
    const { startWidth, startHeight, startCoordinateArr } = this
    if (
      typeof startWidth === 'undefined' ||
      typeof startHeight === 'undefined'
    ) {
      return this
    }
    const scaleX = width / startWidth
    const scaleY = height / startHeight
    this.coordinateArr = startCoordinateArr.map((coordinate) => {
      const nx = coordinate[0] * scaleX
      const ny = coordinate[1] * scaleY
      return [nx, ny, ...coordinate.slice(2)]
    })
    const rect: any = getBoundingRect(this.coordinateArr)
    const offsetX = rect.x - x
    const offsetY = rect.y - y
    this.coordinateArr = this.coordinateArr.map(
      (coordinate: string | any[]) => [
        coordinate[0] - offsetX,
        coordinate[1] - offsetY,
        ...coordinate.slice(2)
      ]
    )
    this.updatePos(x, y)
    this.updateSize(width, height)
    return this
  }

  // Rotate the individual coordinates of a graphic object according to the specified centre coordinates
  rotateByCenter(rotate: number, cx: number, cy: number) {
    this.coordinateArr = this.startCoordinateArr.map((coordinate) => {
      const np = getRotatedCoordinate(
        coordinate[0],
        coordinate[1],
        cx,
        cy,
        rotate
      )
      return [np.x, np.y, ...coordinate.slice(2)]
    })
    this.updateMultiplexCoordinateBoundingRect()
  }

  // Serialisation
  serialize() {
    const base = super.serialize()
    return {
      ...base,
      coordinateArr: [...this.coordinateArr]
    }
  }

  // Get a list of the end coordinates of the graph after the rotation has been applied
  getEndCoordinateList() {
    return this.coordinateArr.map((coordinate: number[]) => {
      const center = getNodeCenterCoordinate(this as any)
      const np = getRotatedCoordinate(
        coordinate[0],
        coordinate[1],
        center.x,
        center.y,
        this.rotate as number
      )
      return {
        x: np.x,
        y: np.y
      }
    })
  }

  // Adding coordinates, graphs with multiple coordinate data, e.g. line segments, free lines
  addCoordinate(x: number, y: number, ...args: any[]) {
    if (!Array.isArray(this.coordinateArr)) {
      return undefined
    }
    this.coordinateArr.push([x, y, ...args])
    return this
  }

  // Update of graphical object enclosures for graphs with multiple coordinate data
  updateMultiplexCoordinateBoundingRect() {
    const rect: any = getBoundingRect(this.coordinateArr)
    this.x = rect.x
    this.y = rect.y
    this.width = rect.width
    this.height = rect.height
    return this
  }

  // Update virtual coordinates coordinates
  updateFictitiousCoordinate(x: number, y: number) {
    this.fictitiousCoordinate.x = x
    this.fictitiousCoordinate.y = y
  }

  // Moving graphic objects
  move(ox: number, oy: number) {
    this.coordinateArr = this.startCoordinateArr.map((coordinate) => [
      coordinate[0] + ox,
      coordinate[1] + oy,
      ...coordinate.slice(2)
    ])
    const { startX, startY } = this
    if (startX && startY) {
      this.x = startX + ox
      this.y = startY + oy
    }
    return this
  }

  // Save the initial state of the graphic object
  saveState() {
    const { rotate, x, y, width, height, coordinateArr } = this
    this.startRotate = rotate
    this.startX = x
    this.startY = y
    this.startCoordinateArr = deepCopy(coordinateArr)
    this.startWidth = width
    this.startHeight = height
    return this
  }
}
