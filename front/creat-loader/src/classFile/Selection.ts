import { DRAG_NODE_PARTS } from '../common/constants'
import { getBoundingRect, throttle } from '../common/utils'
import Calculate from '../common/utils/Calculate'
import MultiplexSelectNode from '../components/MultiplexSelectNode'
import Rectangle from '../components/Rectangle'
import Canvas from '../support/Canvas'
import { AppObject, Ctx, Node, NodeArray, State } from '../types'

export default class Selection {
  public app: AppObject

  public canvas: any

  public ctx: Ctx | undefined

  public createSelection: boolean

  hasSelection: boolean

  public isResize: boolean

  public state: State

  public width: number

  public height: number

  public calculate: Calculate

  public rectangle: Rectangle

  public multiplexSelectNode: MultiplexSelectNode

  constructor(app: AppObject) {
    this.app = app

    this.canvas = null

    this.ctx = undefined

    // Is a selection currently being created
    this.createSelection = false

    // Whether there is currently a multiple selection of graphic objects
    this.hasSelection = false

    // Whether the selected graphic object is currently being adjusted
    this.isResize = false

    this.state = this.app.state

    this.width = this.app.width

    this.height = this.app.height

    this.calculate = new Calculate(this as unknown as AppObject)

    // Selection Rectangle
    this.rectangle = new Rectangle(
      {
        type: 'rectangle',
        style: {
          strokeStyle: 'rgba(9,132,227,0.3)',
          fillStyle: 'rgba(9,132,227,0.3)'
        }
      } as any,
      this as any
    )

    // Virtual graphic object of the selected graphic object for displaying the drag and drop box
    this.multiplexSelectNode = new MultiplexSelectNode(
      {
        type: 'multiplexSelectNode'
      } as any,
      this as any
    )

    // @ts-ignore
    this.checkInNodes = throttle(this.checkInNodes, this, 20)

    // A little relief from lag
    this.handleResize = throttle(this.handleResize, this as any, 15)

    this.init()

    this.bindEvent()
  }

  // Detection of nodes in the selection
  checkInNodes(e: any, event: any) {
    const minX = Math.min(event.mousedownPos.x, e.clientX)
    const minY = Math.min(event.mousedownPos.y, e.clientY)
    const maxX = Math.max(event.mousedownPos.x, e.clientX)
    const maxY = Math.max(event.mousedownPos.y, e.clientY)
    const selectedNodeList: any[] | undefined = []
    this.app.nodes.nodeList.forEach((node: Node) => {
      let _minX = Infinity
      let _maxX = -Infinity
      let _minY = Infinity
      let _maxY = -Infinity
      const endCoordinateList = node?.getEndCoordinateList?.()
      const rect: any = getBoundingRect(
        endCoordinateList.map((coordinate: { x: number; y: number }) => [
          coordinate.x,
          coordinate.y
        ]),
        true
      )
      rect.forEach(({ x, y }: any) => {
        if (x < _minX) {
          _minX = x
        }
        if (x > _maxX) {
          _maxX = x
        }
        if (y < _minY) {
          _minY = y
        }
        if (y > _maxY) {
          _maxY = y
        }
      })
      if (_minX >= minX && _maxX <= maxX && _minY >= minY && _maxY <= maxY) {
        selectedNodeList.push(node)
      }
    })
    this.setMultiplexSelectNodes(selectedNodeList, true)
    this.app.render.render()
  }

  // Detects if the specified position is on the graphic object adjustment handle
  checkInResizeHand(x: any, y: any) {
    return this.multiplexSelectNode.dragNode.checkCoordinateInDragNodeWhere(
      x,
      y
    )
  }

  // Delete the currently selected graphic object
  deleteSelectedNodes() {
    this.getSelectionNodes().forEach((node: Node) => {
      this.app.nodes.deleteNode(node)
    })
    this.selectNodes([])
    this.app.emitChange()
  }

  // Whether the selected graphic object currently exists
  hasSelectionNodes() {
    return this.getSelectionNodes().length > 0
  }

  // Get the currently selected graphic object
  getSelectionNodes() {
    return this.multiplexSelectNode.selectedNodeList
  }

  // Copy the currently selected graphic objects
  async copySelectionNodes(pos: { x: number; y: number }) {
    const task = this.getSelectionNodes().map((node) =>
      this.app.nodes.copyNode(node, true)
    )
    const nodes = await Promise.all(task)
    this.setMultiplexSelectNodes(nodes)
    // Paste to the specified location
    if (pos) {
      this.multiplexSelectNode.startResize(DRAG_NODE_PARTS.BODY)
      if (
        !this.multiplexSelectNode.x ||
        !this.multiplexSelectNode.y ||
        !this.multiplexSelectNode.width ||
        !this.multiplexSelectNode.height
      ) {
        // eslint-disable-next-line no-console
        console.error('multiplexSelectNode x or y or width or height is null')
        return
      }
      const ox =
        pos.x - this.multiplexSelectNode.x - this.multiplexSelectNode.width / 2
      const oy =
        pos.y - this.multiplexSelectNode.y - this.multiplexSelectNode.height / 2
      // If the grid is turned on, then the coordinates are to be attached to the grid
      const gridAdsorbentPos = this.app.calculate.gridAdsorbent(ox, oy)
      this.multiplexSelectNode.resize(
        null,
        null,
        null,
        gridAdsorbentPos.x,
        gridAdsorbentPos.y
      )
      this.multiplexSelectNode.endResize()
      this.multiplexSelectNode.updateRect()
    }
    this.app.render.render()
    this.renderSelection()
    this.app.emitChange()
  }

  // Check if a graphic object adjustment operation is required
  checkIsResize(x: number, y: number, e: any) {
    if (!this.hasSelection) {
      return false
    }
    const hand =
      this.multiplexSelectNode.dragNode.checkCoordinateInDragNodeWhere(x, y)
    if (hand) {
      this.isResize = true
      this.multiplexSelectNode.startResize(hand, e)
      this.app.cursor.setResize(hand)
      return true
    }
    return false
  }

  // Performing graphic object adjustment operations
  handleResize(...args: any[]) {
    if (!this.isResize) {
      return
    }
    this.multiplexSelectNode.resize(...args)
    this.app.render.render()
    this.multiplexSelectNode.updateRect()
    this.renderSelection()
  }

  // Ending a graphic object adjustment operation
  endResize() {
    this.isResize = false
    this.multiplexSelectNode.endResize()
  }

  // Styling of multi-selected graphic objects
  setSelectedNodeStyle(style = {}) {
    if (!this.hasSelectionNodes()) {
      return
    }
    Object.keys(style).forEach((key) => {
      this.getSelectionNodes().forEach((node) => {
        // @ts-ignore
        node.style[key] = style[key]
      })
    })
    this.app.render.render()
    this.app.emitChange()
  }

  // Select the specified graphic object
  selectNodes(nodes = []) {
    this.hasSelection = nodes.length > 0
    this.setMultiplexSelectNodes(nodes)
    this.app.render.render()
    this.renderSelection()
    this.emitChange()
  }

  // Set the selected graphic object
  setMultiplexSelectNodes(nodes: NodeArray = [], notUpdateRect?: boolean) {
    this.multiplexSelectNode.setSelectedNodeList(nodes)
    if (!notUpdateRect) {
      this.multiplexSelectNode.updateRect()
    }
  }

  emitChange() {
    this.app.emit('multiplexSelectChange', this.getSelectionNodes())
  }

  bindEvent() {
    this.app.on('change', () => {
      this.state = this.app.state
      this.multiplexSelectNode.updateNodes(this.app.nodes.nodeList)
      this.renderSelection()
    })
    this.app.on('scrollChange', () => {
      this.renderSelection()
    })
    this.app.on('zoomChange', () => {
      this.renderSelection()
    })
  }

  onMousedown(
    e: { originEvent: { which: number } },
    event: { mousedownPos: { x: number; y: number } }
  ) {
    if (e.originEvent.which !== 1) {
      return
    }
    this.createSelection = true
    this.rectangle.updatePos(event.mousedownPos.x, event.mousedownPos.y)
  }

  onMousemove(e: number, event: { mouseOffset: { x: number; y: number } }) {
    if (
      Math.abs(event.mouseOffset.x) <= 10 &&
      Math.abs(event.mouseOffset.y) <= 10
    ) {
      return
    }
    this.onMove(e, event)
  }

  onMouseup() {
    this.createSelection = false
    this.rectangle.updateRect(0, 0, 0, 0)
    // 判断是否有图形对象被选中
    this.hasSelection = this.hasSelectionNodes()
    this.multiplexSelectNode.updateRect()
    this.renderSelection()
    this.emitChange()
  }

  // Mouse movement events
  onMove(e: number, event: { mouseOffset: { x: number; y: number } }) {
    this.rectangle.updateSize(event.mouseOffset.x, event.mouseOffset.y)
    this.renderSelection()
    this.checkInNodes(e, event)
  }

  reset() {
    this.setMultiplexSelectNodes([])
    this.hasSelection = false
    this.renderSelection()
    this.emitChange()
  }

  renderSelection() {
    this.canvas.clearCanvas()
    this.ctx?.save()
    if (this.app.state.scale) {
      this.ctx?.scale(this.app.state.scale, this.app.state.scale)
    }
    this.rectangle.render()
    this.multiplexSelectNode.render()
    this.ctx?.restore()
  }

  init() {
    if (this.canvas) {
      this.app.mountEL.removeChild(this.canvas.el)
    }
    this.width = this.app.width
    this.height = this.app.height
    this.canvas = new Canvas(this.width, this.height, {
      className: 'selection'
    })
    this.ctx = this.canvas.ctx
    this.app.mountEL.appendChild(this.canvas.el)
  }
}
