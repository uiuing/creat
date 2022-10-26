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

export function checkIsAtCircleEdge(node: any, rp: Rp) {
  const { width, height, x, y } = node
  const radius = getCircleRadius(width, height)
  const dis = getCoordinateSpace(rp.x, rp.y, x + radius, y + radius)
  const onCircle =
    dis >= radius - CLICK_FAULT_TOWER && dis <= radius + CLICK_FAULT_TOWER
  return onCircle ? node : null
}

export function clickIsEdgeFreeSegment(node: any, rp: Rp) {
  let flag: any = null
  node.coordinates.forEach((coordinate: number[]) => {
    if (flag) return
    const dis = getCoordinateSpace(rp.x, rp.y, coordinate[0], coordinate[1])
    if (dis <= CLICK_FAULT_TOWER) {
      flag = node
    }
  })
  return flag
}

export const checkIsAtDiamondEdge = (node: any, rp: Rp) => {
  const { x, y, width, height } = node
  const segments: Segments = [
    [x + width / 2, y, x + width, y + height / 2],
    [x + width, y + height / 2, x + width / 2, y + height],
    [x + width / 2, y + height, x, y + height / 2],
    [x, y + height / 2, x + width / 2, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? node : null
}

export const checkIsTriangleEdge = (node: any, rp: Rp) => {
  const { x, y, width, height } = node
  const segments: Segments = [
    [x + width / 2, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x + width / 2, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? node : null
}

export function checkIsLineEdge(node: any, rp: Rp) {
  const segments: Segments = []
  const len = node.coordinates.length
  const arr: Array<[x: number, y: number]> = node.coordinates
  for (let i = 0; i < len - 1; i += 1) {
    segments.push([...arr[i], ...arr[i + 1]])
  }
  return checkAGregBrokenLine(segments, rp) ? node : null
}

export function checkIsClickInSidMatrix(node: any, rp: Rp) {
  return checkCoordinateIsInRectangle(rp.x, rp.y, node) ? node : null
}

export const checkIsArrowEdge = (node: any, rp: Rp) => {
  const { coordinates } = node
  const x = coordinates[0][0]
  const y = coordinates[0][1]
  const tx = coordinates[coordinates.length - 1][0]
  const ty = coordinates[coordinates.length - 1][1]
  const segments: Segments = [[x, y, tx, ty]]
  return checkAGregBrokenLine(segments, rp) ? node : null
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

export function clickIsEdgeRectangle(node: any, rp: Rp) {
  const { x, y, width, height } = node
  const segments: Segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y]
  ]
  return checkAGregBrokenLine(segments, rp) ? node : null
}
