import {
  degToRad,
  getFontString,
  radToDeg,
  splitTextLines
} from '../common/utils'

type Coordinates = Array<[x: number, y: number]>

export function plotCircle(
  context: any,
  x: number,
  y: number,
  r: number,
  fill = false
) {
  plotContain(
    context,
    () => {
      context.arc(x, y, r, 0, 2 * Math.PI)
    },
    fill
  )
}

export function plotLine(context: any, coordinates: Coordinates) {
  plotContain(context, () => {
    let first = true
    coordinates.forEach((coordinate) => {
      if (first) {
        first = false
        context.moveTo(coordinate[0], coordinate[1])
      } else {
        context.lineTo(coordinate[0], coordinate[1])
      }
    })
  })
}

export function plotText(context: any, textObj: any, x: number, y: number) {
  const { text, style } = textObj
  const lineHeight = style.fontSize * style.lineHeightRatio
  plotContain(context, () => {
    context.font = getFontString(style.fontSize, style.fontFamily)
    context.textBaseline = 'middle'
    const textArr = splitTextLines(text)
    textArr.forEach((textRow, index) => {
      context.fillText(textRow, x, y + (index * lineHeight + lineHeight / 2))
    })
  })
}

export function plotRectangle(
  context: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(context, () => {
    context.rect(x, y, width, height)
    if (fill) {
      context.fillRect(x, y, width, height)
    }
  })
}

export function plotLineSegment(
  context: any,
  mx: number,
  my: number,
  tx: number,
  ty: number,
  lineWidth = 0
) {
  plotContain(context, () => {
    if (lineWidth > 0) {
      context.lineWidth = lineWidth
    }
    context.moveTo(mx, my)
    context.lineTo(tx, ty)
    context.lineCap = 'round'
    context.lineJoin = 'round'
  })
}

export function plotDiamond(
  context: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(
    context,
    () => {
      context.moveTo(x + width / 2, y)
      context.lineTo(x + width, y + height / 2)
      context.lineTo(x + width / 2, y + height)
      context.lineTo(x, y + height / 2)
      context.closePath()
    },
    fill
  )
}

export function plotTriangle(
  context: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(
    context,
    () => {
      context.moveTo(x + width / 2, y)
      context.lineTo(x + width, y + height)
      context.lineTo(x, y + height)
      context.closePath()
    },
    fill
  )
}

export function plotFreeLine(
  context: any,
  coordinates: Coordinates,
  options: { app: any; cx: any; cy: any }
) {
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    plotContain(
      context,
      () => {
        const coordinate = transformLineCoordinate(coordinates[i], options)
        const nextCoordinate = transformLineCoordinate(
          coordinates[i + 1],
          options
        )
        plotLineSegment(
          context,
          coordinate[0],
          coordinate[1],
          nextCoordinate[0],
          nextCoordinate[1],
          nextCoordinate[2]
        )
      },
      true
    )
  }
}

export function plotImage(
  context: any,
  node: any,
  x: number,
  y: number,
  width: number,
  height: number
) {
  plotContain(context, () => {
    const ratio = width / height
    let showWidth = 0
    let showHeight = 0
    if (ratio > node.ratio) {
      showHeight = height
      showWidth = node.ratio * height
    } else {
      showWidth = width
      showHeight = width / node.ratio
    }
    context.plotImage(node.imageObject, x, y, showWidth, showHeight)
  })
}

export function plotArrow(context: any, coordinates: Coordinates) {
  const x = coordinates[0][0]
  const y = coordinates[0][1]
  const tx = coordinates[coordinates.length - 1][0]
  const ty = coordinates[coordinates.length - 1][1]
  plotContain(
    context,
    () => {
      context.moveTo(x, y)
      context.lineTo(tx, ty)
    },
    true
  )
  const l = 30
  const deg = 30
  const lineDeg = radToDeg(Math.atan2(ty - y, tx - x))
  plotContain(
    context,
    () => {
      const plusDeg = deg - lineDeg
      const x1 = tx - l * Math.cos(degToRad(plusDeg))
      const y1 = ty + l * Math.sin(degToRad(plusDeg))
      context.moveTo(x1, y1)
      context.lineTo(tx, ty)
    },
    true
  )
  plotContain(context, () => {
    const plusDeg = 90 - lineDeg - deg
    const x1 = tx - l * Math.sin(degToRad(plusDeg))
    const y1 = ty - l * Math.cos(degToRad(plusDeg))
    context.moveTo(x1, y1)
    context.lineTo(tx, ty)
  })
}

function transformLineCoordinate(
  coordinate: string | any[],
  options: {
    app: any
    cx: number
    cy: number
  }
) {
  const { x, y } = options.app.coordinate.transform(
    coordinate[0],
    coordinate[1]
  )
  return [x - options.cx, y - options.cy, ...coordinate.slice(2)]
}

export function plotContain(context: any, fn: Function, fill = false) {
  context.beginPath()
  fn()
  context.stroke()
  if (fill) {
    context.fill()
  }
}
