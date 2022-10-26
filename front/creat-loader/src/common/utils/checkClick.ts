import { CLICK_FAULT_TOWER } from '../constants'
import {
  checkCoordinateIsInRectangle,
  checkIsClickLine,
  getCoordinateSpace
} from './index'

type Segments = Array<[x1: number, y1: number, x2: number, y2: number]>
type Rp = { xs?: number; ys?: number; x: number; y: number }

export function getCircleRadius(width: number, height: number) {
  return Math.min(Math.abs(width), Math.abs(height)) / 2
}

export function checkIsAtCircleEdge(element: any, rp: Rp) {
  const { width, height, x, y } = element
  const radius = getCircleRadius(width, height)
  const dis = getCoordinateSpace(rp.x, rp.y, x + radius, y + radius)
  const onCircle =
    dis >= radius - CLICK_FAULT_TOWER && dis <= radius + CLICK_FAULT_TOWER
  return onCircle ? element : null
}

export function clickIsEdgeFreeSegment(element: any, rp: Rp) {
  let flag: any = null
  element.coordinates.forEach((coordinate: number[]) => {
    if (flag) return
    const dis = getCoordinateSpace(rp.x, rp.y, coordinate[0], coordinate[1])
    if (dis <= CLICK_FAULT_TOWER) {
      flag = element
    }
  })
  return flag
}

export const checkIsAtDiamondEdge = (element: any, rp: Rp) => {
  const { x, y, width, height } = element
  const segments: Segments = [
    [x + width / 2, y, x + width, y + height / 2],
    [x + width, y + height / 2, x + width / 2, y + height],
    [x + width / 2, y + height, x, y + height / 2],
    [x, y + height / 2, x + width / 2, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? element : null
}

export const checkIsTriangleEdge = (element: any, rp: Rp) => {
  const { x, y, width, height } = element
  const segments: Segments = [
    [x + width / 2, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x + width / 2, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? element : null
}

export function checkIsLineEdge(element: any, rp: Rp) {
  const segments: Segments = []
  const len = element.coordinates.length
  const arr: Array<[x: number, y: number]> = element.coordinates
  for (let i = 0; i < len - 1; i += 1) {
    segments.push([...arr[i], ...arr[i + 1]])
  }
  return checkAGregBrokenLine(segments, rp) ? element : null
}

export function checkIsClickInSidMatrix(element: any, rp: Rp) {
  return checkCoordinateIsInRectangle(rp.x, rp.y, element) ? element : null
}

export const checkIsArrowEdge = (element: any, rp: Rp) => {
  const { coordinates } = element
  const x = coordinates[0][0]
  const y = coordinates[0][1]
  const tx = coordinates[coordinates.length - 1][0]
  const ty = coordinates[coordinates.length - 1][1]
  const segments: Segments = [[x, y, tx, ty]]
  return checkAGregBrokenLine(segments, rp) ? element : null
}

export function checkAGregBrokenLine(segments: Segments, rp: Rp) {
  let flag = false
  segments.forEach((seg) => {
    if (flag) {
      return
    }
    if (checkIsClickLine(rp.x, rp.y, ...seg, CLICK_FAULT_TOWER)) {
      flag = true
    }
  })
  return flag
}

export function clickIsEdgeRectangle(element: any, rp: Rp) {
  const { x, y, width, height } = element
  const segments: Segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? element : null
}
