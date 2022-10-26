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
  pointArr: Array<[x: number, y: number]> = [],
  returnCorners = false
) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  pointArr.forEach((point) => {
    const [x, y] = point
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
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  if (!options.noTranslate && ctx) {
    ctx.translate(canvas.width / 2, canvas.height / 2)
  }
  return {
    canvas,
    ctx
  }
}

export function getPointSpace(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getPointLineSpace(
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
  if (getPointLineSpace(x, y, x1, y1, x2, y2) > ds) {
    return false
  }
  const d1 = getPointSpace(x, y, x1, y1)
  const d2 = getPointSpace(x, y, x2, y2)
  const d3 = getPointSpace(x1, y1, x2, y2)
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
  const dis = getPointSpace(x, y, cx, cy)
  return {
    x: Math.cos(degToRad(del)) * dis + cx,
    y: Math.sin(degToRad(del)) * dis + cy
  }
}

export function getElementCenterPoint(element: any) {
  const { x, y, width, height } = element
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

export function getReversRotateGetMouse(x: number, y: number, element: any) {
  const center = getElementCenterPoint(element)
  return getReversRotateCardin(x, y, center.x, center.y, element.rotate)
}

export function getElementFourCornerCardin(element: any, posit: FourCorner) {
  const { x, y, width, height } = element
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

export function getElementRotatedFourCornerCardin(
  element: any,
  posit: FourCorner
) {
  const center = getElementCenterPoint(element)
  const dirPos = getElementFourCornerCardin(element, posit)
  return getRotateAngleCardin(
    dirPos.x,
    dirPos.y,
    center.x,
    center.y,
    element.rotate
  )
}

export function checkPointIsInRectangle(
  x: number,
  y: number,
  rx?: any,
  ry?: any,
  rw?: undefined,
  rh?: undefined
) {
  const o = { rx, ry, rw, rh }
  if (typeof rx === 'object') {
    const element = rx
    o.rx = element.x
    o.ry = element.y
    o.rw = element.width
    o.rh = element.height
  }
  return x >= o.rx && x <= o.rx + o.rw && y >= o.ry && y <= o.ry + o.rh
}

export function getElementCorners(element: any) {
  const topLeft = getElementRotatedFourCornerCardin(element, 'topLeft')
  const topRight = getElementRotatedFourCornerCardin(element, 'topRight')
  const bottomLeft = getElementRotatedFourCornerCardin(element, 'bottomLeft')
  const bottomRight = getElementRotatedFourCornerCardin(element, 'bottomRight')
  return [topLeft, topRight, bottomLeft, bottomRight]
}

export function getMultiElementRectInfo(elementList: Array<any> = []) {
  if (elementList.length <= 0) {
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
  elementList.forEach((element) => {
    const pointList: Array<{ x: number; y: number }> = element.getEndpointList()
    pointList.forEach(({ x, y }) => {
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

export function createNodeKey() {
  nodeKeyIndex += 1
}

export function getWrapTextActWidth(element: any) {
  const { text } = element
  const textArr = splitTextLines(text)
  let maxWidth = -Infinity
  textArr.forEach((textRow) => {
    const width = getTextActWidth(textRow, element.style)
    if (width > maxWidth) {
      maxWidth = width
    }
  })
  return maxWidth
}

export function getTextElementSize(element: any) {
  const { text, style } = element
  const width = getWrapTextActWidth(element)
  const lines = Math.max(splitTextLines(text).length, 1)
  const lineHeight = style.fontSize * style.lineHeightRatio
  const height = lines * lineHeight
  return {
    width,
    height
  }
}

export function throttle(fn: Function, ctx: any, time = 100) {
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
