import { FourCorner } from '../../types'

export function computedLineWidthBySpeed(
  speed: number,
  lastLineWidth: number,
  baseLineWidth = 2
) {
  let lineWidth: number
  const maxLineWidth = baseLineWidth + 2
  const maxSpeed = 10
  const minSpeed = 0.5
  let lastWidth = lastLineWidth
  if (speed >= maxSpeed) {
    lineWidth = baseLineWidth
  } else if (speed <= minSpeed) {
    lineWidth = maxLineWidth + 1
  } else {
    lineWidth =
      maxLineWidth - ((speed - minSpeed) / (maxSpeed - minSpeed)) * maxLineWidth
  }
  if (lastLineWidth === -1) {
    lastWidth = maxLineWidth
  }
  return lineWidth * (1 / 2) + lastWidth * (1 / 2)
}

export function getBoundingRect(
  coordinates: Array<[x: number, y: number]> = [],
  returnCorners = false
) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  coordinates.forEach((coordinate) => {
    const [x, y] = coordinate
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
  if (returnCorners) {
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

export function deepCopy(obj: object) {
  return JSON.parse(JSON.stringify(obj))
}

export function getFontString(fontSize: number, fontFamily: string) {
  return `${fontSize}px ${fontFamily}`
}

export function splitTextLines(text: string) {
  return text.replace(/\r\n?/g, '\n').split('\n')
}

let textCheckEl: HTMLDivElement | null = null

export function getTextActWidth(
  text: string,
  style: { fontSize: number; fontFamily: string }
) {
  if (!textCheckEl) {
    textCheckEl = document.createElement('div')
    textCheckEl.style.position = 'fixed'
    textCheckEl.style.left = '-999999px'
    document.body.appendChild(textCheckEl)
  }
  const { fontSize, fontFamily } = style
  textCheckEl.innerText = text
  textCheckEl.style.fontSize = `${fontSize}px`
  textCheckEl.style.fontFamily = fontFamily
  const { width } = textCheckEl.getBoundingClientRect()
  return width
}

export function createCanvas(
  width: number,
  height: number,
  options = { noStyle: false, noTranslate: false, className: '' }
) {
  const canvas = document.createElement('canvas')
  if (!options.noStyle) {
    canvas.style.cssText = `position: absolute;left: 0;top: 0;`
  }
  if (options.className) {
    canvas.className = options.className
  }
  const context = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  if (!options.noTranslate && context) {
    context.translate(canvas.width / 2, canvas.height / 2)
  }
  return {
    canvas,
    context
  }
}

export function getCoordinateSpace(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getCoordinateLineSpace(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  if (x1 === x2) {
    return Math.abs(x - x1)
  }
  const B = 1
  const A = (y1 - y2) / (x2 - x1)
  const C = 0 - B * y1 - A * x1
  return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B))
}

export function checkIsClickLine(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number | undefined,
  y2: number | undefined,
  ds = 10
) {
  if (x2 === undefined || y2 === undefined) {
    return false
  }
  if (getCoordinateLineSpace(x, y, x1, y1, x2, y2) > ds) {
    return false
  }
  const d1 = getCoordinateSpace(x, y, x1, y1)
  const d2 = getCoordinateSpace(x, y, x2, y2)
  const d3 = getCoordinateSpace(x1, y1, x2, y2)
  const max = Math.sqrt(ds * ds + d3 * d3)
  return d1 <= max && d2 <= max
}

export function radToDeg(rad: number) {
  return rad * (180 / Math.PI)
}

export function degToRad(deg: number) {
  return deg * (Math.PI / 180)
}

export function getCardinDifferAngle(
  cx: number,
  cy: number,
  tx: number,
  ty: number,
  fx: number,
  fy: number
) {
  return radToDeg(Math.atan2(ty - cy, tx - cx) - Math.atan2(fy - cy, fx - cx))
}

export function getRotateAngleCardin(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotate: number
) {
  const deg = radToDeg(Math.atan2(y - cy, x - cx))
  const del = deg + rotate
  const dis = getCoordinateSpace(x, y, cx, cy)
  return {
    x: Math.cos(degToRad(del)) * dis + cx,
    y: Math.sin(degToRad(del)) * dis + cy
  }
}

export function getNodeCenterCoordinate(node: any) {
  const { x, y, width, height } = node
  return {
    x: x + width / 2,
    y: y + height / 2
  }
}

export function getReversRotateCardin(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotate: number
) {
  let xs = x
  let ys = y
  if (rotate !== 0) {
    const rp = getRotateAngleCardin(xs, ys, cx, cy, -rotate)
    xs = rp.x
    ys = rp.y
  }
  return {
    xs,
    ys
  }
}

export function getReversRotateGetMouse(x: number, y: number, node: any) {
  const center = getNodeCenterCoordinate(node)
  return getReversRotateCardin(x, y, center.x, center.y, node.rotate)
}

export function getNodeFourCornerCardin(node: any, posit: FourCorner) {
  const { x, y, width, height } = node
  switch (posit) {
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
      return {
        x,
        y
      }
  }
}

export function getNodeRotatedFourCornerCardin(node: any, posit: FourCorner) {
  const center = getNodeCenterCoordinate(node)
  const dirPos = getNodeFourCornerCardin(node, posit)
  return getRotateAngleCardin(
    dirPos.x,
    dirPos.y,
    center.x,
    center.y,
    node.rotate
  )
}

export function checkCoordinateIsInRectangle(
  x: number,
  y: number,
  rx?: any,
  ry?: any,
  rw?: undefined,
  rh?: undefined
) {
  const o = { rx, ry, rw, rh }
  if (typeof rx === 'object') {
    const node = rx
    o.rx = node.x
    o.ry = node.y
    o.rw = node.width
    o.rh = node.height
  }
  return x >= o.rx && x <= o.rx + o.rw && y >= o.ry && y <= o.ry + o.rh
}

export function getNodeCorners(node: any) {
  const topLeft = getNodeRotatedFourCornerCardin(node, 'topLeft')
  const topRight = getNodeRotatedFourCornerCardin(node, 'topRight')
  const bottomLeft = getNodeRotatedFourCornerCardin(node, 'bottomLeft')
  const bottomRight = getNodeRotatedFourCornerCardin(node, 'bottomRight')
  return [topLeft, topRight, bottomLeft, bottomRight]
}

export function getMultiNodeRectInfo(nodeList: Array<any> = []) {
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
    const coordinateList: Array<{ x: number; y: number }> =
      node.getEndcoordinateList()
    coordinateList.forEach(({ x, y }) => {
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

export function createImageObj(url: string) {
  return new Promise((resolve) => {
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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let nodeKeyIndex = 0

export function createElementKey() {
  nodeKeyIndex += 1
}

export function getWrapTextActWidth(node: any) {
  const { text } = node
  const textArr = splitTextLines(text)
  let maxWidth = -Infinity
  textArr.forEach((textRow) => {
    const width = getTextActWidth(textRow, node.style)
    if (width > maxWidth) {
      maxWidth = width
    }
  })
  return maxWidth
}

export function getTextNodeSize(node: any) {
  const { text, style } = node
  const width = getWrapTextActWidth(node)
  const lines = Math.max(splitTextLines(text).length, 1)
  const lineHeight = style.fontSize * style.lineHeightRatio
  const height = lines * lineHeight
  return {
    width,
    height
  }
}

export function throttle(fn: Function, context: any, time = 100) {
  let timer: number | null = null
  return (...args: any) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.call(context, ...args)
      timer = null
    }, time)
  }
}
