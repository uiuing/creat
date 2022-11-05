import { createCanvas, getMultiplexNodeRectInfo } from '../common/utils'
import { AppObject, Ctx, Node, NodeArray } from '../types'
import Background from './Background'

export default class Export {
  public app: AppObject

  public openPreview: boolean

  public saveState: {
    width: number
    scale: number
    scrollY: number
    scrollX: number
    height: number
    ctx?: Ctx
  }

  constructor(app: AppObject) {
    this.app = app

    this.openPreview = false

    this.saveState = {
      scale: 0,
      scrollX: 0,
      scrollY: 0,
      width: 0,
      height: 0
    }
  }

  // Export as json data
  exportJson() {
    return this.app.getData()
  }

  // Draw all graphic objects
  render(ctx: Ctx, onlySelected: boolean) {
    ctx.save()
    this.getNodeList(onlySelected).forEach((node: Node) => {
      if (node.noRender) {
        return
      }
      const cacheActive = node.isActive
      const cacheSelected = node.isSelected
      node.isActive = false
      node.isSelected = false
      node.render()
      node.isActive = cacheActive
      node.isSelected = cacheSelected
    })
    ctx.restore()
  }

  // Save the current state data of the app class
  saveAppState() {
    const { width, height, state, ctx } = this.app
    this.saveState.width = width
    this.saveState.height = height
    if (state.scale) {
      this.saveState.scale = state.scale
    }
    if (state.scrollX) {
      this.saveState.scrollX = state.scrollX
    }
    if (state.scrollY) {
      this.saveState.scrollY = state.scrollY
    }
    this.saveState.ctx = ctx
  }

  // Export as image
  exportImage({
    type = 'image/png',
    renderBg = true,
    useBlob = false,
    paddingX = 10,
    paddingY = 10,
    onlySelected = true
  } = {}) {
    const { minX, maxX, minY, maxY } = getMultiplexNodeRectInfo(
      this.getNodeList(onlySelected)
    )
    const width = maxX - minX + paddingX * 2
    const height = maxY - minY + paddingY * 2
    // Creating an export canvas
    const { canvas, ctx } = createCanvas(width, height, {
      noStyle: true,
      noTranslate: true
    })
    if (!ctx) {
      // eslint-disable-next-line no-console
      console.error('Create Export Canvas Error')
      return ''
    }
    this.show(canvas)
    this.saveAppState()
    this.changeAppState(minX - paddingX, minY - paddingY, ctx)
    // Painting background colours
    if (renderBg && this.app.state.backgroundColor && ctx) {
      Background.canvasAddBackgroundColor(
        ctx,
        width,
        height,
        this.app.state.backgroundColor
      )
    }
    // Drawing graphic objects to exported canvas
    this.render(ctx, onlySelected)
    this.recoveryAppState()

    if (useBlob) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject()
          }
        }, type)
      })
    }
    return canvas.toDataURL(type)
  }

  show(canvas: HTMLCanvasElement) {
    if (this.openPreview) {
      canvas.style.cssText = `position: absolute;left: 0;top: 0;background-color: #fff;`
      document.body.appendChild(canvas)
    }
  }

  // Recovery of app class status data
  recoveryAppState() {
    const { width, height, scale, scrollX, scrollY, ctx } = this.saveState
    this.app.state.scale = scale
    this.app.state.scrollX = scrollX
    this.app.state.scrollY = scrollY
    this.app.width = width
    this.app.height = height
    if (ctx) {
      this.app.ctx = ctx
    }
  }

  // Temporary modification of app class status data
  changeAppState(minX: number, minY: number, ctx: Ctx) {
    this.app.ctx = ctx
    this.app.width = minX * 2
    this.app.height = minY * 2
    this.app.state.scale = 1
    this.app.state.scrollX = 0
    this.app.state.scrollY = 0
  }

  // Get the graphic object to be exported
  getNodeList(onlySelected = true) {
    // Exporting all graphic objects
    if (!onlySelected) {
      return this.app.nodes.nodeList
    }
    // Export only active or selected graphic objects
    let selectedNodes: NodeArray = []
    if (this.app.nodes.activeNode) {
      selectedNodes.push(this.app.nodes.activeNode)
    } else if (this.app.selection.hasSelectionNodes()) {
      selectedNodes = this.app.selection.getSelectionNodes()
    }
    return this.app.nodes.nodeList.filter((node: Node) =>
      selectedNodes.includes(node)
    )
  }
}
