import { DRAG_NODE_PARTS } from '../common/constants'
import {
  computedLineWidthBySpeed,
  createImageObj,
  getNodeID,
  getTowCoordinateDistance,
  throttle
} from '../common/utils'
import ArbitraryPlot from '../components/ArbitraryPlot'
import Arrow from '../components/Arrow'
import Circle from '../components/Circle'
import Diamond from '../components/Diamond'
import Image from '../components/Image'
import Line from '../components/Line'
import Rectangle from '../components/Rectangle'
import Text from '../components/Text'
import Triangle from '../components/Triangle'
import { AppObject, Ctx, Node, NodeArray, PlotType } from '../types'

export default class Nodes {
  public app: AppObject

  public nodeList: NodeArray

  activeNode: Node | undefined

  public isCreateNode: boolean

  public isResize: boolean

  public resizeNode: Node | null

  constructor(app: AppObject) {
    this.app = app

    // All graphic objects
    this.nodeList = []

    // Currently active graphic object
    this.activeNode = undefined

    // A new graphic object is currently being created
    this.isCreateNode = false

    // The graphic object is currently being adjusted
    this.isResize = false

    // The graphic object currently being adjusted
    this.resizeNode = null

    // A little relief from lag
    this.handleResize = throttle(this.handleResize, this as any, 15)
  }

  createNode(
    options: any,
    callback: (...args: any) => void = () => {},
    ctx?: Ctx,
    notActive?: boolean
  ) {
    if (this.hasActiveNode() || this.isCreateNode) {
      return this
    }
    options.id = getNodeID()
    const node: any = this.pureCreateNode(options)
    if (!node) {
      return this
    }
    this.addNode(node)
    if (!notActive) {
      this.setActiveNode(node)
    }
    this.isCreateNode = true
    // @ts-ignore
    callback.call(ctx, node)
    return this
  }

  copyNode(node: Node, notActive?: boolean, pos?: { x: number; y: number }) {
    return new Promise<any>(async (resolve) => {
      if (!node) {
        return
      }
      const data: any = node.serialize?.()
      if (data.type === 'image' && data.url != null) {
        data.imageObj = (await createImageObj(data.url)) as HTMLInputElement
      }
      this.createNode(
        data,
        (node: any) => {
          node.startResize(DRAG_NODE_PARTS.BODY)
          let ox = 20
          let oy = 20
          if (pos) {
            ox = pos.x - node.x - node.width / 2
            oy = pos.y - node.y - node.height / 2
          }
          const gridAdsorbentPos = this.app.calculate.gridAdsorbent(ox, oy)
          node.resize(null, null, null, gridAdsorbentPos.x, gridAdsorbentPos.y)
          node.isCreate = false
          if (notActive) {
            node.isActive = false
          }
          this.isCreateNode = false
          resolve(node)
        },
        this as unknown as Ctx,
        notActive
      )
    })
  }

  // Rectangle-like graphic object being created
  createRectangleLikeNode(
    type: PlotType,
    x: number,
    y: number,
    offsetX: number,
    offsetY: number
  ) {
    this.createNode({
      type,
      x,
      y,
      width: offsetX,
      height: offsetY
    })
    this.activeNode?.updateSize?.(offsetX, offsetY)
  }

  // Circular graphic object being created
  createCircle(x: number, y: number, e: { clientX: any; clientY: any }) {
    this.createNode({
      type: 'circle',
      x,
      y
    })
    const radius = getTowCoordinateDistance(e.clientX, e.clientY, x, y)
    this.activeNode?.updateSize?.(radius, radius)
  }

  // Freehand brush graphic object being created
  createArbitraryPlot(
    e: { clientX: any; clientY: any },
    event: { mouseSpeed: number; lastMousePos: { x: number; y: number } }
  ) {
    this.createNode({
      type: 'arbitrary-plot'
    })
    const node = this.activeNode
    // Calculating brush thickness
    const lineWidth = computedLineWidthBySpeed(
      event.mouseSpeed,
      <number>node?.lastLineWidth
    )
    if (node?.lastLineWidth) {
      node.lastLineWidth = lineWidth
    }
    node?.addCoordinate?.(e.clientX, e.clientY, lineWidth)
    // The brush is not repainted and incremental painting is used, otherwise it will lag
    const { calculate, ctx, state } = this.app
    const tfp = calculate.transformToCanvasCalculate(
      calculate.subScrollX(event.lastMousePos.x),
      calculate.subScrollY(event.lastMousePos.y)
    )
    const ttp = calculate.transformToCanvasCalculate(
      calculate.subScrollX(e.clientX),
      calculate.subScrollY(e.clientY)
    )
    ctx.save()
    ctx.scale(<number>state.scale, <number>state.scale)
    node?.singleRender?.(tfp.x, tfp.y, ttp.x, ttp.y, lineWidth)
    ctx.restore()
  }

  // Image graphic object being created
  createImage(
    e: { unGridClientX: number; unGridClientY: number },
    {
      width,
      height,
      imageObj,
      url,
      ratio
    }: {
      width: number
      height: number
      imageObj: HTMLInputElement
      url: string
      ratio: number
    }
  ) {
    const gp = this.app.calculate.gridAdsorbent(
      e.unGridClientX - width / 2,
      e.unGridClientY - height / 2
    )
    this.createNode({
      type: 'image',
      x: gp.x,
      y: gp.y,
      url,
      imageObj,
      width,
      height,
      ratio
    })
  }

  // Text graphic object being edited
  editingText(node: Node) {
    if (node.type !== 'text') {
      return
    }
    node.noRender = true
    this.setActiveNode(node)
  }

  // Complete editing of text graphic objects
  completeEditingText() {
    const node = this.activeNode
    if (!node || node.type !== 'text') {
      return
    }
    if (!node?.text?.trim()) {
      this.deleteNode(node)
      this.setActiveNode()
      return
    }
    node.noRender = false
  }

  // Complete the creation of the arrow graphic object
  completeCreateArrow(e: { clientX: number; clientY: number }) {
    this.activeNode?.addCoordinate?.(e.clientX, e.clientY)
  }

  // Arrowhead graphic object being created
  createArrow(x: number, y: number, e: { clientX: any; clientY: any }) {
    this.createNode(
      {
        type: 'arrow',
        x,
        y
      },
      (node) => {
        node.addCoordinate(x, y)
      }
    )
    this.activeNode?.updateFictitiousCoordinate?.(e.clientX, e.clientY)
  }

  // Line/line graphical object being created
  createLine(
    x: number | undefined,
    y: number | undefined,
    e: { clientX: number; clientY: number },
    isSingle = false,
    notCreate = false
  ) {
    if (!notCreate) {
      this.createNode(
        {
          type: 'line',
          x,
          y,
          isSingle
        },
        (node) => {
          node.addCoordinate(x, y)
        }
      )
    }
    const node = this.activeNode
    if (node) {
      node.updateFictitiousCoordinate?.(e.clientX, e.clientY)
    }
  }

  insertNode(node: Node, index: number) {
    this.nodeList.splice(index, 0, node)
  }

  addNode(node: Node) {
    this.nodeList.push(node)
    return this
  }

  getNodesNum() {
    return this.nodeList.length
  }

  hasNodes() {
    return this.nodeList.length > 0
  }

  unshiftNode(node: Node) {
    this.nodeList.unshift(node)
    return this
  }

  // Deleting graphic objects
  deleteNode(node: Node) {
    const index = this.getNodeIndex(node)
    if (index !== -1) {
      this.nodeList.splice(index, 1)
      if (node.isActive) {
        this.cancelActiveNode()
      }
    }
    return this
  }

  // Delete all graphic objects
  deleteAllNodes() {
    this.activeNode = undefined
    this.nodeList = []
    this.isCreateNode = false
    this.isResize = false
    this.resizeNode = null
    return this
  }

  // Get the index of the graphic object in the list of graphic objects
  getNodeIndex(node: Node) {
    return this.nodeList.findIndex((item) => item === node)
  }

  // Create graphic objects from graphic object data
  createNodesFromData(nodes: NodeArray) {
    this.app.oldData = this.app.getData()
    nodes.forEach((node) => {
      const nodeObject: any = this.pureCreateNode(node)
      nodeObject.isActive = false
      nodeObject.isCreate = false
      this.addNode(nodeObject as Node)
    })
    return this
  }

  // Presence or absence of active graphic objects
  hasActiveNode() {
    return this.activeNode
  }

  // Setting the activation of graphic objects
  setActiveNode(node?: Node) {
    this.cancelActiveNode()
    this.activeNode = node
    if (node) {
      node.isActive = true
    }
    this.app.emit('activeNodeChange', this.activeNode)
    return this
  }

  // Cancel the currently active graphic object
  cancelActiveNode() {
    if (!this.hasActiveNode()) {
      return this
    }
    if (this.activeNode) {
      this.activeNode.isActive = false
      this.activeNode = undefined
    }
    this.app.emit('activeNodeChange', this.activeNode)
    return this
  }

  // Detects if a graphic object is selected by a coordinate click
  checkIsClickNode(e: any) {
    const x = e.unGridClientX
    const y = e.unGridClientY
    for (let i = this.nodeList.length - 1; i >= 0; i -= 1) {
      const node = this.nodeList[i]
      if (node.isClick?.(x, y)) {
        return node
      }
    }
    return null
  }

  pureCreateNode(options: any = {}) {
    switch (options.type) {
      case 'rectangle':
        return new Rectangle(options, this.app)
      case 'diamond':
        return new Diamond(options, this.app)
      case 'triangle':
        return new Triangle(options, this.app)
      case 'circle':
        return new Circle(options, this.app)
      case 'arbitrary-plot':
        return new ArbitraryPlot(options, this.app)
      case 'image':
        return new Image(options, this.app)
      case 'arrow':
        return new Arrow(options, this.app)
      case 'line':
        return new Line(options, this.app)
      case 'text':
        return new Text(options, this.app)
      default:
        return null
    }
  }

  // Complete the creation of line/dash graphical objects
  completeCreateLine(
    e: { clientX: number; clientY: number },
    completeCallback = () => {}
  ) {
    let node = this.activeNode
    const x = e.clientX
    const y = e.clientY
    if (node && node.isSingle) {
      node.addCoordinate?.(x, y)
      completeCallback()
    } else {
      this.createNode({
        type: 'line',
        isSingle: false
      })
      node = this.activeNode
      node?.addCoordinate?.(x, y)
      node?.updateFictitiousCoordinate?.(x, y)
    }
  }

  // Creation of graphic objects complete
  completeCreateNode() {
    this.isCreateNode = false
    const node: any = this.activeNode
    if (!node) {
      return this
    }
    if (['arbitrary-plot', 'arrow', 'line'].includes(node.type)) {
      node.updateMultiplexCoordinateBoundingRect()
    }
    node.isCreate = false
    this.app.emitChange()
    return this
  }

  // Styling of active graphic objects
  setActiveNodeStyle(style = {}) {
    if (!this.hasActiveNode()) {
      return this
    }
    Object.keys(style).forEach((key) => {
      // @ts-ignore
      this.activeNode.style[key] = style[key]
    })
    return this
  }

  // Detects if the specified position is on the graphic object adjustment handle
  checkInResizeHand(x: any, y: any) {
    const node = this.activeNode
    const hand = node?.dragNode?.checkCoordinateInDragNodeWhere?.(x, y)
    if (hand) {
      return {
        node,
        hand
      }
    }
    return null
  }

  // Check if a graphic object adjustment operation is required
  checkIsResize(x: number, y: number, e: any) {
    if (!this.hasActiveNode()) {
      return false
    }
    const res = this.checkInResizeHand(x, y)
    if (res) {
      this.isResize = true
      if (res.node) {
        this.resizeNode = res.node
        this.resizeNode.startResize?.(res.hand, e)
      }
      this.app.cursor.setResize(res.hand)
      return true
    }
    return false
  }

  // Performing graphic object adjustment operations
  handleResize(...args: any[]) {
    if (!this.isResize) {
      return
    }
    this.resizeNode?.resize?.(...args)
  }

  // Ending a graphic object adjustment operation
  endResize() {
    this.isResize = false
    this.resizeNode?.endResize?.()
    this.resizeNode = null
  }

  // Serialize all graphic objects on the current canvas
  serialize(stringify = false) {
    const data = this.nodeList.map((node) => node.serialize?.())
    return stringify ? JSON.stringify(data) : data
  }
}
