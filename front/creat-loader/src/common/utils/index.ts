import { Ctx, LocalData, Node, NodeArray, Style } from '../../types'

// Generate an ID, seeded with a timestamp + random number, with the first half random and the second half incremental
export function getNodeID() {
  const seed = Math.floor(Math.random() * 1e12) * 1e7 + new Date().getTime()
  return seed.toString(36)
}

// Unique key for graphical objects
let nodeKeyIndex = 0
export function createNodeKey() {
  nodeKeyIndex += 1
  return nodeKeyIndex
}

export const deepCopy = (obj: LocalData) => JSON.parse(JSON.stringify(obj))

// Download the file
export const downloadFile = (file: string, fileName: string) => {
  const a = document.createElement('a')
  a.href = file
  a.download = fileName
  a.click()
}

// Throttling
export const throttle = (fn: any, ctx: Ctx, time = 20) => {
  let timer: number | null = null
  return (...args: any) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.call(ctx, ...args)
      timer = null
    }, time)
  }
}

// Spliced text font size string
export const getFontString = (fontSize: number, fontFamily: string) =>
  `${fontSize}px ${fontFamily}`

// Text cut into lines
export const splitTextLines = (text: string) =>
  text.replace(/\r\n?/g, '\n').split('\n')

// Curvature to angle
export const radToDeg = (rad: number) => rad * (180 / Math.PI)

// Angle to radians
export const degToRad = (deg: number) => deg * (Math.PI / 180)

export const createCanvas = (
  width: number,
  height: number,
  option: { noStyle?: boolean; noTranslate?: boolean; className?: string } = {
    noStyle: false,
    noTranslate: false,
    className: ''
  }
) => {
  const canvas = document.createElement('canvas')
  if (!option.noStyle) {
    canvas.style.cssText = `position: absolute;left: 0;top: 0;`
  }
  if (option.className) {
    canvas.className = option.className
  }
  // Get Drawing Context
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  // Move the canvas origin to the centre of the canvas
  if (!option.noTranslate) {
    ctx?.translate(canvas.width / 2, canvas.height / 2)
  }
  return {
    canvas,
    ctx
  }
}

// Calculate the distance between two coordinates
export const getTowCoordinateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

// Calculate the distance from a point to a line
export const getCoordinateToLineDistance = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  // Straight line perpendicular to x-axis
  if (x1 === x2) {
    return Math.abs(x - x1)
  }
  const B = 1
  const A = (y1 - y2) / (x2 - x1)
  const C = 0 - B * y1 - A * x1
  return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B))
}

// Check if you have clicked on a line segment
export const checkIsAtSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number | undefined,
  y2: number | undefined,
  dis = 10
) => {
  if (typeof x2 === 'undefined' || typeof y2 === 'undefined') {
    return false
  }
  if (getCoordinateToLineDistance(x, y, x1, y1, x2, y2) > dis) {
    return false
  }
  const dis1 = getTowCoordinateDistance(x, y, x1, y1)
  const dis2 = getTowCoordinateDistance(x, y, x2, y2)
  const dis3 = getTowCoordinateDistance(x1, y1, x2, y2)
  const max = Math.sqrt(dis * dis + dis3 * dis3)
  return dis1 <= max && dis2 <= max
}

// Calculate the angle of difference between two coordinates with the same centre point
export const getTowCoordinateRotate = (
  cx: number,
  cy: number,
  tx: number,
  ty: number,
  fx: number,
  fy: number
) => radToDeg(Math.atan2(ty - cy, tx - cx) - Math.atan2(fy - cy, fx - cx))

// Get coordinates rotated by a specified angle from a specified centre, clockwise or anti-clockwise rotate by passing positive or negative
export const getRotatedCoordinate = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotate: number
) => {
  const deg = radToDeg(Math.atan2(y - cy, x - cx))
  const del = deg + rotate
  const dis = getTowCoordinateDistance(x, y, cx, cy)
  return {
    x: Math.cos(degToRad(del)) * dis + cx,
    y: Math.sin(degToRad(del)) * dis + cy
  }
}

// Get the coordinates of the element's centroid
export const getNodeCenterCoordinate = (node: any) => {
  const { x, y, width, height }: any = node as Node
  return {
    x: x + width / 2,
    y: y + height / 2
  }
}

// Rotate the coordinates by the specified angle at the specified centre point
export const transformCoordinateReverseRotate = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotate: number
) => {
  if (rotate !== 0) {
    const rp = getRotatedCoordinate(x, y, cx, cy, -rotate)
    x = rp.x
    y = rp.y
  }
  return {
    x,
    y
  }
}

//  Handles mouse coordinates according to whether the element is rotated or not, if the element is rotated, then the mouse coordinates are rotated backwards
export const transformCoordinateOnNode = (x: number, y: number, node: any) => {
  const center = getNodeCenterCoordinate(node as Node)
  return transformCoordinateReverseRotate(
    x,
    y,
    center.x,
    center.y,
    <number>node.rotate
  )
}

// Get the four corner coordinates of the object
export const getNodeFourCornerCoordinate = (node: Node, dir: string) => {
  const { x, y, width, height }: any = node
  switch (dir) {
    case 'topLeft':
      return {
        x,
        y
      }
    case 'topRight':
      return {
        x: x + width,
        y
      }
    case 'bottomRight':
      return {
        x: x + width,
        y: y + height
      }
    case 'bottomLeft':
      return {
        x,
        y: y + height
      }
    default:
      break
  }
  return {}
}

// Get the outer bounding box for multiple coordinates
export const getBoundingRect = (
  coordinateArr = [],
  returnFourCorners = false
) => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  coordinateArr.forEach((coordinate) => {
    const [x, y]: Array<number> = coordinate
    if (x < minX) {
      minX = x
    }
    if (x > maxX) {
      maxX = x
    }
    if (y < minY) {
      minY = y
    }
    if (y > maxY) {
      maxY = y
    }
  })
  const x = minX
  const y = minY
  const width = maxX - minX
  const height = maxY - minY
  // Return in four corner coordinates
  if (returnFourCorners) {
    return [
      {
        x,
        y
      },
      {
        x: x + width,
        y
      },
      {
        x: x + width,
        y: y + height
      },
      {
        x,
        y: y + height
      }
    ]
  }
  return {
    x,
    y,
    width,
    height
  }
}

// Get the coordinates of the four corners of a rotated graphic object
export const getNodeRotatedFourCornerCoordinate = (node: Node, dir: string) => {
  const center = getNodeCenterCoordinate(node)
  const dirPos = getNodeFourCornerCoordinate(node, dir)
  if (!dirPos || !dirPos.x || !dirPos.y) {
    return 0
  }
  return getRotatedCoordinate(
    dirPos.x,
    dirPos.y,
    center.x,
    center.y,
    <number>node.rotate
  )
}

// Determines whether a coordinate is within a rectangle. rx can be a graphical object with x, y, width, height
export const checkCoordinateIsInRectangle = (
  x: number,
  y: number,
  rx: number | Node,
  ry?: number | undefined,
  rw?: number | undefined,
  rh?: number | undefined
) => {
  if (typeof rx === 'object') {
    const node = rx
    rx = node.x as number
    ry = node.y
    rw = node.width
    rh = node.height
  }
  if (
    typeof ry === 'undefined' ||
    typeof rw === 'undefined' ||
    typeof rh === 'undefined'
  ) {
    return false
  }
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh
}

// Get the outermost bounding box information of multiple graphic objects
export const getMultiplexNodeRectInfo = (nodeList: NodeArray = []) => {
  if (nodeList.length <= 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
  }
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  nodeList.forEach((node) => {
    const coordinateList = node?.getEndcoordinateList?.()
    coordinateList.forEach(({ x, y }: { x: number; y: number }) => {
      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }
      if (y < minY) {
        minY = y
      }
      if (y > maxY) {
        maxY = y
      }
    })
  })
  return {
    minX,
    maxX,
    minY,
    maxY
  }
}

// Calculate the actual rendering width of the text
let textCheckEl: HTMLDivElement | null = null
export const getTextActWidth = (text: string, style: Style) => {
  if (!textCheckEl) {
    textCheckEl = document.createElement('div')
    textCheckEl.style.position = 'fixed'
    textCheckEl.style.left = '-99999px'
    document.body.appendChild(textCheckEl)
  }
  const { fontSize, fontFamily } = style
  textCheckEl.innerText = text
  textCheckEl.style.fontSize = `${fontSize}px`
  textCheckEl.style.fontFamily = fontFamily
  const { width } = textCheckEl.getBoundingClientRect()
  return width
}

//  Gets the coordinates of the four corners of the graphical object, after applying the rotation
export const getNodeFourCorners = (node: Node) => {
  const bottomRight = getNodeRotatedFourCornerCoordinate(node, 'bottomRight')
  const topLeft = getNodeRotatedFourCornerCoordinate(node, 'topLeft')
  const topRight = getNodeRotatedFourCornerCoordinate(node, 'topRight')
  const bottomLeft = getNodeRotatedFourCornerCoordinate(node, 'bottomLeft')
  return [topLeft, topRight, bottomLeft, bottomRight]
}

// Creating picture objects
export const createImageObj = (url: string) =>
  new Promise((resolve) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = url
  })

// Calculate the maximum font size that will fit all text within a fixed width
export const getMaxFontSizeInWidth = (
  text: string,
  width: number,
  style: { fontSize: number; fontFamily: string }
) => {
  let fontSize = 12
  while (
    getTextActWidth(text, {
      ...style,
      fontSize: fontSize + 1
    }) < width
  ) {
    fontSize += 1
  }
  return fontSize
}

// Calculating the actual width of line feed text
export const getWrapTextActWidth = (node: Node) => {
  const { text }: any = node
  const textArr = splitTextLines(text)
  let maxWidth = -Infinity
  textArr.forEach((textRow) => {
    const width = getTextActWidth(textRow, <any>node.style)
    if (width > maxWidth) {
      maxWidth = width
    }
  })
  return maxWidth
}

// Calculate the number of words in the longest line of newline text
export const getWrapTextMaxRowTextNumber = (text: string) => {
  const textArr = splitTextLines(text)
  let maxNumber = -Infinity
  textArr.forEach((textRow) => {
    if (textRow.length > maxNumber) {
      maxNumber = textRow.length
    }
  })
  return maxNumber
}

// Calculate the width and height of a text graphic object
export const getTextNodeSize = (node: Node) => {
  const { text, style }: any = node
  const width = getWrapTextActWidth(node)
  const lines = Math.max(splitTextLines(text).length, 1)
  const lineHeight = style.fontSize * style.lineHeightRatio
  const height = lines * lineHeight
  return {
    width,
    height
  }
}

// Calculate brush thickness based on speed
export const computedLineWidthBySpeed = (
  speed: number,
  lastLineWidth: number,
  baseLineWidth = 2
) => {
  let lineWidth = 0
  const maxLineWidth = baseLineWidth + 2
  const maxSpeed = 10
  const minSpeed = 0.5
  if (speed >= maxSpeed) {
    lineWidth = baseLineWidth
  } else if (speed <= minSpeed) {
    lineWidth = maxLineWidth + 1
  } else {
    lineWidth =
      maxLineWidth - ((speed - minSpeed) / (maxSpeed - minSpeed)) * maxLineWidth
  }
  if (lastLineWidth === -1) {
    lastLineWidth = maxLineWidth
  }
  return lineWidth * 0.5 + lastLineWidth * 0.3
}
