import {
  degToRad,
  getFontString,
  radToDeg,
  splitTextLines
} from '../common/utils'
import { Ctx } from '../types'

// Drawing public operations
export const plotWrap = (ctx: Ctx, fn: any, fill = false) => {
  ctx.beginPath()
  fn()
  ctx.stroke()
  if (fill) {
    ctx.fill()
  }
}

// Drawing circle
export const plotCircle = (
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  fill = false
) => {
  plotWrap(
    ctx,
    () => {
      ctx.arc(x, y, r, 0, 2 * Math.PI)
    },
    fill
  )
}

// Drawing arrows
export const plotArrow = (ctx: Ctx, coordinateArr: any[]) => {
  const x = coordinateArr[0][0]
  const y = coordinateArr[0][1]
  const tx = coordinateArr[coordinateArr.length - 1][0]
  const ty = coordinateArr[coordinateArr.length - 1][1]
  plotWrap(
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
  plotWrap(
    ctx,
    () => {
      const plusDeg = deg - lineDeg
      const _x = tx - l * Math.cos(degToRad(plusDeg))
      const _y = ty + l * Math.sin(degToRad(plusDeg))
      ctx.moveTo(_x, _y)
      ctx.lineTo(tx, ty)
    },
    true
  )
  plotWrap(ctx, () => {
    const plusDeg = 90 - lineDeg - deg
    const _x = tx - l * Math.sin(degToRad(plusDeg))
    const _y = ty - l * Math.cos(degToRad(plusDeg))
    ctx.moveTo(_x, _y)
    ctx.lineTo(tx, ty)
  })
}

// Drawing rectangles
export const plotRect = (
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) => {
  plotWrap(ctx, () => {
    ctx.rect(x, y, width, height)
    if (fill) {
      ctx.fillRect(x, y, width, height)
    }
  })
}

// Drawing a diamond
export const plotDiamond = (
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = false
) => {
  plotWrap(
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

// Convert the coordinates of the brush to the coordinates of the canvas
const transformArbitraryLineCoordinate = (
  coordinate: string | any[],
  opt: {
    app: {
      calculate: { transform: (arg0: any, arg1: any) => { x: any; y: any } }
    }
    cx: number
    cy: number
  }
) => {
  const { x, y } = opt.app.calculate.transform(coordinate[0], coordinate[1])
  return [x - opt.cx, y - opt.cy, ...coordinate.slice(2)]
}

// Drawing line segments
export const plotLineSegment = (
  ctx: Ctx,
  mx: number,
  my: number,
  tx: number,
  ty: number,
  lineWidth = 0
) => {
  plotWrap(ctx, () => {
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
    }
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  })
}

// Drawing triangles
export const plotTriangle = (
  ctx: Ctx,
  x: number,
  y: number,
  width: number,
  height: any,
  fill = false
) => {
  plotWrap(
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

// Drawing free line segments (Also known as a paintbrush)
export const plotArbitraryLine = (
  ctx: Ctx,
  coordinates: string | any[],
  opt: any
) => {
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    plotWrap(
      ctx,
      () => {
        const coordinate = transformArbitraryLineCoordinate(coordinates[i], opt)
        const nextCoordinate = transformArbitraryLineCoordinate(
          coordinates[i + 1],
          opt
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

// Drawing text
export const plotText = (ctx: Ctx, textObj: any, x: number, y: number) => {
  const { text, style } = textObj
  const lineHeight = style.fontSize * style.lineHeightRatio
  plotWrap(ctx, () => {
    ctx.font = getFontString(style.fontSize, style.fontFamily)
    ctx.textBaseline = 'middle'
    const textArr = splitTextLines(text)
    textArr.forEach((textRow, index) => {
      ctx.fillText(textRow, x, y + (index * lineHeight + lineHeight / 2))
    })
  })
}

// Drawing pictures
export const plotImage = (
  ctx: Ctx,
  node: any,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  plotWrap(ctx, () => {
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
    ctx.drawImage(node.imageObj, x, y, showWidth, showHeight)
  })
}

// Draw the line
export const plotLine = (ctx: Ctx, coordinates: any[]) => {
  plotWrap(ctx, () => {
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
