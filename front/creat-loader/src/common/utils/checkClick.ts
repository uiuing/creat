import { Node } from '../../types'
import { CLICK_DISTANCE } from '../constants'
import {
  checkCoordinateIsInRectangle,
  checkIsAtSegment,
  getTowCoordinateDistance
} from './index'

type Segments = Array<[x1: number, y1: number, x2: number, y2: number]>
type Rp = { xs?: number; ys?: number; x: number; y: number }

// Detects if a click is inside a rectangle
export const checkIsAtRectangleInner = (node: any, rp: Rp) =>
  checkCoordinateIsInRectangle(rp.x, rp.y, node as Node) ? node : null

// Calculate the radius of the circle from the width and height
export const getCircleRadius = (width: number, height: number) =>
  Math.min(Math.abs(width), Math.abs(height)) / 2

// Detects if a click is made on the fold
export const checkIsAtMultiplexSegment = (segments: Segments, rp: Rp) => {
  let res = false
  segments.forEach((seg) => {
    if (res) return
    if (checkIsAtSegment(rp.x, rp.y, ...seg, CLICK_DISTANCE)) {
      res = true
    }
  })
  return res
}

// Calculate the radius of the circle from the width and height
export const checkIsAtCircleEdge = (node: any, rp: Rp) => {
  const { width, height, x, y } = node as Node
  const radius = getCircleRadius(width, height)
  const dis = getTowCoordinateDistance(rp.x, rp.y, x + radius, y + radius)
  const onCircle =
    dis >= radius - CLICK_DISTANCE && dis <= radius + CLICK_DISTANCE
  return onCircle ? node : null
}

// Detects if you click on the edge of a rectangle
export const checkIsAtRectangleEdge = (node: any, rp: Rp) => {
  const { x, y, width, height } = node as Node
  const segments: Segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y]
  ]
  return checkIsAtMultiplexSegment(segments, rp) ? node : null
}

// Detects if a triangle edge is clicked on
export const checkIsAtTriangleEdge = (node: Node, rp: Rp) => {
  const { x, y, width, height } = node
  const segments = [
    [x + width / 2, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x + width / 2, y]
  ]
  return checkIsAtMultiplexSegment(segments as Segments, rp) ? node : null
}

// Detects if a diamond edge is clicked on
export const checkIsAtDiamondEdge = (node: any, rp: Rp) => {
  const { x, y, width, height } = node as Node
  const segments = [
    [x + width / 2, y, x + width, y + height / 2],
    [x + width, y + height / 2, x + width / 2, y + height],
    [x + width / 2, y + height, x, y + height / 2],
    [x, y + height / 2, x + width / 2, y]
  ]
  return checkIsAtMultiplexSegment(segments as Segments, rp) ? node : null
}

// Detects if you click on the edge of the arrow
export const checkIsAtArrowEdge = (node: any, rp: Rp) => {
  const { coordinateArr } = node as Node
  if (typeof coordinateArr === 'undefined') {
    return null
  }
  const x = coordinateArr[0][0]
  const y = coordinateArr[0][1]
  const tx = coordinateArr[coordinateArr.length - 1][0]
  const ty = coordinateArr[coordinateArr.length - 1][1]
  const segments = [[x, y, tx, ty]]
  return checkIsAtMultiplexSegment(segments as Segments, rp) ? node : null
}

// Detects if a click is made on the edge of a free line segment
export const checkIsAtArbitraryPlotLineEdge = (node: Node, rp: Rp) => {
  let res: Node | null = null
  if (typeof node.coordinateArr === 'undefined') {
    return null
  }
  node.coordinateArr.forEach((coordinate) => {
    if (res) return
    const dis = getTowCoordinateDistance(
      rp.x,
      rp.y,
      coordinate[0],
      coordinate[1]
    )
    if (dis <= CLICK_DISTANCE) {
      res = node
    }
  })
  return res
}

// Detects if a click is made on the edge of a line segment
export const checkIsAtLineEdge = (node: Node, rp: Rp) => {
  const segments = []
  if (typeof node.coordinateArr === 'undefined') {
    return null
  }
  const len = node.coordinateArr.length
  const arr = node.coordinateArr
  for (let i = 0; i < len - 1; i += 1) {
    segments.push([...arr[i], ...arr[i + 1]])
  }
  return checkIsAtMultiplexSegment(segments as Segments, rp) ? node : null
}
