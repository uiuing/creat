import {
  degToRad,
  getFontString,
  radToDeg,
  splitTextLines
} from '../common/utils'

type Coordinates = Array<[x: number, y: number]>

export function plotCircle(
  ctx: any,
  x: number,
  y: number,
  r: number,
  fill = false
) {
  plotContain(
    ctx,
    () => {
      ctx.arc(x, y, r, 0, 2 * Math.PI)
    },
    fill
  )
}

export function plotLine(ctx: any, coordinates: Coordinates) {
  plotContain(ctx, () => {
    let first = true
    coordinates.forEach((coordinate) => {
      if (first) {
        first = false
        ctx.moveTo(coordinate[0], coordinate[1])
      } else {
        ctx.lineTo(coordinate[0], coordinate[1])
      }
    })
  })
}

export function plotText(ctx: any, textObj: any, x: number, y: number) {
  const { text, style } = textObj
  const lineHeight = style.fontSize * style.lineHeightRatio
  plotContain(ctx, () => {
    ctx.font = getFontString(style.fontSize, style.fontFamily)
    ctx.textBaseline = 'middle'
    const textArr = splitTextLines(text)
    textArr.forEach((textRow, index) => {
      ctx.fillText(textRow, x, y + (index * lineHeight + lineHeight / 2))
    })
  })
}

export function plotRectangle(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(ctx, () => {
    ctx.rect(x, y, width, height)
    if (fill) {
      ctx.fillRect(x, y, width, height)
    }
  })
}

export function plotLineSegment(
  ctx: any,
  mx: number,
  my: number,
  tx: number,
  ty: number,
  lineWidth = 0
) {
  plotContain(ctx, () => {
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
    }
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  })
}

export function plotDiamond(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(
    ctx,
    () => {
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height / 2)
      ctx.lineTo(x + width / 2, y + height)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
    },
    fill
  )
}

export function plotTriangle(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) {
  plotContain(
    ctx,
    () => {
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x, y + height)
      ctx.closePath()
    },
    fill
  )
}

export function plotFreeLine(
  ctx: any,
  coordinates: Coordinates,
  options: { app: any; cx: any; cy: any }
) {
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    plotContain(
      ctx,
      () => {
        const coordinate = transformLineCoordinate(coordinates[i], options)
        const nextCoordinate = transformLineCoordinate(
          coordinates[i + 1],
          options
        )
        plotLineSegment(
          ctx,
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
  ctx: any,
  node: any,
  x: number,
  y: number,
  width: number,
  height: number
) {
  plotContain(ctx, () => {
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
    ctx.plotImage(node.imageObject, x, y, showWidth, showHeight)
  })
}

export function plotArrow(ctx: any, coordinates: Coordinates) {
  const x = coordinates[0][0]
  const y = coordinates[0][1]
  const tx = coordinates[coordinates.length - 1][0]
  const ty = coordinates[coordinates.length - 1][1]
  plotContain(
    ctx,
    () => {
      ctx.moveTo(x, y)
      ctx.lineTo(tx, ty)
    },
    true
  )
  const l = 30
  const deg = 30
  const lineDeg = radToDeg(Math.atan2(ty - y, tx - x))
  plotContain(
    ctx,
    () => {
      const plusDeg = deg - lineDeg
      const x1 = tx - l * Math.cos(degToRad(plusDeg))
      const y1 = ty + l * Math.sin(degToRad(plusDeg))
      ctx.moveTo(x1, y1)
      ctx.lineTo(tx, ty)
    },
    true
  )
  plotContain(ctx, () => {
    const plusDeg = 90 - lineDeg - deg
    const x1 = tx - l * Math.sin(degToRad(plusDeg))
    const y1 = ty - l * Math.cos(degToRad(plusDeg))
    ctx.moveTo(x1, y1)
    ctx.lineTo(tx, ty)
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

export function plotContain(ctx: any, fn: Function, fill = false) {
  ctx.beginPath()
  fn()
  ctx.stroke()
  if (fill) {
    ctx.fill()
  }
}
