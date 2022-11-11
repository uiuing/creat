import EventEmitter from 'eventemitter3'
import { diff, patch } from 'jsondiffpatch'

import Author from './classFile/Author'
import Background from './classFile/Background'
import Cursor from './classFile/Cursor'
import Event from './classFile/Event'
import Export from './classFile/Export'
import Grid from './classFile/Grid'
import History from './classFile/History'
import ImageEdit from './classFile/ImageEdit'
import KeyCommand from './classFile/KeyCommand'
import Nodes from './classFile/Nodes'
import Render from './classFile/Render'
import Selection from './classFile/Selection'
import TextEdit from './classFile/TextEdit'
import {
  createCanvas,
  createImageObj,
  getTowCoordinateDistance,
  throttle
} from './common/utils'
import * as utils from './common/utils'
import Calculate from './common/utils/Calculate'
import * as checkClick from './common/utils/checkClick'
import nodes from './components'
import * as plot from './support/plot'
import {
  Ctx,
  LocalData,
  Node,
  NodeArray,
  OnCallBack,
  PlotType,
  State
} from './types'

type Options = {
  mountEL: HTMLElement | HTMLDivElement
  plotType?: PlotType
  state?: State
}

class CreatLoader extends EventEmitter {
  public options: Options

  public readonly mountEL: HTMLElement | HTMLDivElement

  public plotType: any

  public width: number

  public height: number

  public left: number

  public top: number

  public canvas: HTMLCanvasElement | undefined

  public ctx: Ctx | undefined

  public state: State

  public calculate: Calculate

  public event: Event

  public keyCommand: KeyCommand

  public imageEdit: ImageEdit

  public textEdit: TextEdit

  public cursor: Cursor

  public history: History

  public export: Export

  public background: Background

  public selection: Selection

  public grid: Grid

  public author: Author

  public nodes: any

  public render: Render

  public watch: any

  static utils: any

  static checkClick: any

  static plot: any

  static nodes: any

  constructor(options: Options) {
    super()

    this.options = options

    this.mountEL = options.mountEL

    this.plotType = options.plotType || 'selection'

    // Container width and height position information
    this.width = 0
    this.height = 0
    this.left = 0
    this.top = 0

    // Main rendering canvas graphics objects
    this.canvas = undefined

    // canvas drawing context
    this.ctx = undefined

    // Canvas state
    this.state = {
      // resizing
      scale: 1,
      // Scroll offset in horizontal direction
      scrollX: 0,
      // Scroll offset in vertical direction
      scrollY: 0,
      // Rolling step
      scrollStep: 25,
      // Background colour
      backgroundColor: '',
      // Whether to display the grid or not
      showGrid: false,
      // Is it read-only mode
      readonly: false,
      // Default colour
      defaultColor: '#000000',
      // Grid configuration
      gridConfig: {
        // Grid size
        size: 20,
        // Grid line colours
        strokeStyle: '#dfe0e1',
        // Mesh line width
        lineWidth: 1
      },
      // Coverage
      ...(options.state || {})
    } as any

    this.initCanvas()

    this.calculate = new Calculate(this as any)

    this.event = new Event(this as any)
    this.event.on('mousedown', this.onMousedown, this)
    this.event.on('mousemove', this.onMousemove, this)
    this.event.on('mouseup', this.onMouseup, this)
    this.event.on('dblclick', this.onDblclick, this)
    this.event.on('mousewheel', this.onMousewheel, this)
    this.event.on('contextmenu', this.onContextmenu, this)

    this.keyCommand = new KeyCommand(this as any)

    this.imageEdit = new ImageEdit(this as any)
    this.imageEdit.on('imageSelectChange', this.onImageSelectChange, this)

    this.textEdit = new TextEdit(this as any)
    this.textEdit.on('blur', this.onTextInputBlur, this)

    this.cursor = new Cursor(this as any)

    this.history = new History(this as any)

    this.export = new Export(this as any)

    this.background = new Background(this as any)

    this.selection = new Selection(this as any)

    this.grid = new Grid(this as any)

    this.nodes = new Nodes(this as any)

    this.render = new Render(this as any)

    this.author = new Author(this as any)

    this.mountFunction()

    this.checkIsOnNode = throttle(this.checkIsOnNode, this as any)

    this.emitChange()

    this.helpUpdate()

    this.watch = {
      zoomChange: (callback: OnCallBack) => this.on('zoomChange', callback),
      scrollChange: (callback: OnCallBack) => this.on('scrollChange', callback),
      currentTypeChange: (callback: OnCallBack) =>
        this.on('currentTypeChange', callback),
      shuttle: (callback: OnCallBack) => this.on('shuttle', callback),
      activeNodeChange: (callback: OnCallBack) =>
        this.on('activeNodeChange', callback),
      multiplexSelectChange: (callback: OnCallBack) =>
        this.on('multiplexSelectChange', callback),
      contextmenu: (callback: OnCallBack) => this.on('contextmenu', callback),
      diffNodesChange: (callback: OnCallBack) =>
        this.on('diffNodesChange', callback),
      diffStateChange: (callback: OnCallBack) =>
        this.on('diffStateChange', callback),
      localDataChange: (callback: OnCallBack) => this.on('change', callback),
      nodeRotateChange: (callback: OnCallBack) =>
        this.on('nodeRotateChange', callback)
    }
  }

  mountFunction() {
    ;['exportImage', 'exportJson'].forEach((method) => {
      // @ts-ignore
      this[method] = this.export[method].bind(this.export)
    })
    ;['showGrid', 'hideGrid', 'updateGrid'].forEach((method) => {
      // @ts-ignore
      this[method] = this.grid[method].bind(this.grid)
    })
    ;['setEditAuthor', 'setReadonlyAuthor'].forEach((method) => {
      // @ts-ignore
      this[method] = this.author[method].bind(this.author)
    })
    ;['undo', 'redo'].forEach((method) => {
      // @ts-ignore
      this[method] = this.history[method].bind(this.history)
    })
    ;['unBindEvent', 'bindEvent'].forEach((method) => {
      // @ts-ignore
      this[method] = this.keyCommand[method].bind(this.keyCommand)
    })
    ;['setSelectedNodeStyle', 'cancelSelectNodes'].forEach((method) => {
      // @ts-ignore
      this[method] = this.selection[method].bind(this.selection)
    })
    ;[
      'updateActiveNodeRotate',
      'updateActiveNodeSize',
      'updateActiveNodePosition',
      'cancelActiveNode',
      'scrollToCenter',
      'copyPasteCurrentNodes',
      'empty',
      'zoomIn',
      'zoomOut',
      'setZoom',
      'selectAll',
      'fit',
      'deleteActiveNode',
      'deleteCurrentNodes',
      'setBackgroundColor',
      'copyNode',
      'copyCurrentNode',
      'deleteNode',
      'setActiveNodeStyle',
      'setCurrentNodesStyle',
      'scrollTo',
      'cutCurrentNode',
      'pasteCurrentNode'
    ].forEach((method) => {
      // @ts-ignore
      this[method] = this.render[method].bind(this.render)
    })
  }

  // Access to data, including state data and graphical object data
  getData() {
    return {
      state: {
        ...this.state
      },
      nodes: this.nodes.serialize()
    }
  }

  // Image selection events
  onImageSelectChange() {
    this.cursor.hide()
  }

  // Get container size location information
  getContainerRectInfo() {
    const { width, height, left, top } = this.mountEL.getBoundingClientRect()
    this.width = width
    this.height = height
    this.left = left
    this.top = top
  }

  // Rendering as necessary
  helpUpdate() {
    if (this.state.readonly) {
      // @ts-ignore
      this.setReadonlyAuthor()
    }
    if (this.state.showGrid) {
      this.grid.showGrid()
    }
    this.background.set()
  }

  // Setting data, including status data and graphic object data
  async setData(
    { state = {}, nodes = [] }: any,
    noEmitChange: boolean,
    noDiffData?: boolean
  ) {
    this.state = state

    const nowNs = nodes.map(async (node: Node) => {
      if (node.type === 'image') {
        return {
          ...node,
          imageObj: await createImageObj(<string>node.url)
        }
      }
      return node
    })

    const nNS: any[] = []

    for (const n of nowNs) {
      // eslint-disable-next-line no-await-in-loop
      nNS.push(await n)
    }

    this.helpUpdate()
    this.nodes.deleteAllNodes().createNodesFromData(nNS)
    this.render.render()
    if (!noEmitChange) {
      this.emitChange(noDiffData)
    }
  }

  initCanvas() {
    this.getContainerRectInfo()
    if (this.canvas) {
      this.mountEL.removeChild(this.canvas)
    }
    const { canvas, ctx }: any = createCanvas(this.width, this.height, {
      className: 'main'
    })
    this.canvas = canvas
    this.ctx = ctx
    this.mountEL.appendChild(this.canvas as any)
  }

  // Container resizing
  resize() {
    this.initCanvas()
    this.render.render()
    this.selection.init()
    this.grid.init()
    this.grid.renderGrid()
  }

  // Updating the state data only updates the state data and does not trigger a render
  updateState(data = {}) {
    this.state = {
      ...this.state,
      ...data
    }
    this.emitChange(undefined, true)
  }

  // Update current drawing type
  updateCurrentType(plotType: PlotType) {
    this.plotType = plotType
    if (this.plotType === 'image') {
      this.imageEdit.selectImage()
    }
    if (this.plotType === 'eraser') {
      this.cursor.setEraser()
      // @ts-ignore
      this.cancelActiveNode()
    } else if (this.plotType === 'text') {
      this.cursor.setText()
    } else if (this.plotType !== 'selection') {
      this.cursor.setCrossHair()
    } else {
      this.cursor.reset()
    }
    this.emit('currentTypeChange', this.plotType)
  }

  // Mouse press event
  onMousedown(
    e: {
      unGridClientX?: number
      unGridClientY?: number
      originEvent?: { which: number }
    },
    event: { mousedownPos: any }
  ) {
    if (this.state.readonly || this.author.isDragAuthor) {
      this.author.onStart()
      return
    }
    if (!this.nodes.isCreateNode && !this.textEdit.isEditing) {
      const clickNode = this.nodes.checkIsClickNode(e)
      if (this.plotType === 'selection') {
        if (this.nodes.hasActiveNode()) {
          const isResize = this.nodes.checkIsResize(
            event.mousedownPos.unGridClientX,
            event.mousedownPos.unGridClientY,
            e
          )
          if (!isResize) {
            this.nodes.setActiveNode(clickNode as any)
            this.render.render()
          }
        } else if (this.selection.hasSelection) {
          const isResize = this.selection.checkIsResize(
            event.mousedownPos.unGridClientX,
            event.mousedownPos.unGridClientY,
            e
          )
          if (!isResize) {
            this.selection.reset()
            this.nodes.setActiveNode(clickNode as any)
            this.render.render()
          }
        } else if (clickNode) {
          this.nodes.setActiveNode(clickNode)
          this.render.render()
          this.onMousedown(e, event)
        } else {
          this.selection.onMousedown(e as any, event)
        }
      } else if (this.plotType === 'eraser') {
        // @ts-ignore
        this.deleteNode(clickNode)
      }
    }
  }

  // Mouse movement events
  onMousemove(e: any, event: any) {
    // TODO : Real-time synchronisation, currently on mouse up, expected to be on mouse over
    if (this.state.readonly || this.author.isDragAuthor) {
      if (event.isMousedown) {
        this.author.onMove(e, event)
      }
      return
    }
    if (event.isMousedown) {
      const mx = event.mousedownPos.x
      const my = event.mousedownPos.y
      const offsetX = Math.max(event.mouseOffset.x, 0)
      const offsetY = Math.max(event.mouseOffset.y, 0)
      if (this.plotType === 'selection') {
        if (this.selection.isResize) {
          this.selection.handleResize(
            e,
            mx,
            my,
            event.mouseOffset.x,
            event.mouseOffset.y
          )
        } else if (this.selection.createSelection) {
          this.selection.onMousemove(e, event)
        } else {
          this.nodes.handleResize(
            e,
            mx,
            my,
            event.mouseOffset.x,
            event.mouseOffset.y
          )
          this.render.render()
        }
      } else if (['rectangle', 'diamond', 'triangle'].includes(this.plotType)) {
        this.nodes.createRectangleLikeNode(
          this.plotType,
          mx,
          my,
          offsetX,
          offsetY
        )
        this.render.render()
      } else if (this.plotType === 'circle') {
        this.nodes.createCircle(mx, my, e)
        this.render.render()
      } else if (this.plotType === 'arbitrary-plot') {
        this.nodes.createArbitraryPlot(e, event)
      } else if (this.plotType === 'arrow') {
        this.nodes.createArrow(mx, my, e)
        this.render.render()
      } else if (this.plotType === 'line') {
        if (getTowCoordinateDistance(mx, my, e.clientX, e.clientY) > 3) {
          this.nodes.createLine(mx, my, e, true)
          this.render.render()
        }
      }
    } else if (this.imageEdit.isReady) {
      this.cursor.hide()
      this.imageEdit.updatePreviewElPos(
        e.originEvent.clientX,
        e.originEvent.clientY
      )
    } else if (this.plotType === 'selection') {
      if (this.nodes.hasActiveNode()) {
        const handData: any = ''
        const h = this.nodes.checkInResizeHand(e.unGridClientX, e.unGridClientY)
        if (h) {
          this.cursor.setResize(handData.hand)
        } else {
          // @ts-ignore
          this.checkIsOnNode(e)
        }
      } else if (this.selection.hasSelection) {
        const hand = this.selection.checkInResizeHand(
          e.unGridClientX,
          e.unGridClientY
        )
        if (hand) {
          this.cursor.setResize(hand)
        } else {
          // @ts-ignore
          this.checkIsOnNode(e)
        }
      } else {
        // @ts-ignore
        this.checkIsOnNode(e)
      }
    } else if (this.plotType === 'line') {
      this.nodes.createLine(undefined, undefined, e, false, true)
      this.render.render()
    }
  }

  // Detects if a graphic object has been slid over
  checkIsOnNode(e: { unGridClientX: number; unGridClientY: number }) {
    const clickNode = this.nodes.checkIsClickNode(e)
    if (clickNode) {
      this.cursor.setMove()
    } else {
      this.cursor.reset()
    }
  }

  // Reset current type to selection mode
  resetCurrentType() {
    if (this.plotType !== 'selection') {
      this.plotType = 'selection'
      this.emit('currentTypeChange', 'selection')
    }
  }

  // Creation of new graphic objects complete
  completeCreateNewNode() {
    this.resetCurrentType()
    this.nodes.completeCreateNode()
    this.render.render()
  }

  // Mouse release event
  onMouseup(e: any) {
    if (this.state.readonly || this.author.isDragAuthor) {
      return
    }
    if (this.plotType === 'text') {
      if (!this.textEdit.isEditing) {
        this.createTextNode(e)
        this.resetCurrentType()
      }
    } else if (this.imageEdit.isReady) {
      this.nodes.createImage(e, this.imageEdit.imageData as any)
      this.completeCreateNewNode()
      this.cursor.reset()
      this.imageEdit.reset()
    } else if (this.plotType === 'arrow') {
      this.nodes.completeCreateArrow(e)
      this.completeCreateNewNode()
    } else if (this.plotType === 'line') {
      this.nodes.completeCreateLine(e, () => {
        this.completeCreateNewNode()
      })
      this.render.render()
    } else if (this.nodes.isCreateNode) {
      if (this.plotType === 'arbitrary-plot') {
        this.nodes.completeCreateNode()
        this.nodes.setActiveNode()
      } else {
        this.completeCreateNewNode()
      }
    } else if (this.nodes.isResize) {
      this.nodes.endResize()
      this.emitChange()
    } else if (this.selection.createSelection) {
      this.selection.onMouseup()
    } else if (this.selection.isResize) {
      this.selection.endResize()
      this.emitChange()
    }
  }

  // Double click event
  onDblclick(e: { unGridClientX: number; unGridClientY: number }) {
    if (this.plotType === 'line') {
      this.completeCreateNewNode()
    } else {
      const clickNode = this.nodes.checkIsClickNode(e)
      if (clickNode) {
        if (clickNode.type === 'text') {
          this.nodes.editingText(clickNode)
          this.render.render()
          this.keyCommand.unBindEvent()
          this.textEdit.showTextEdit()
        }
      } else if (!this.textEdit.isEditing) {
        // @ts-ignore
        this.createTextNode(e)
      }
    }
  }

  // Text box out-of-focus event
  onTextInputBlur() {
    this.keyCommand.bindEvent()
    this.nodes.completeEditingText()
    this.render.render()
    this.emitChange()
  }

  // Creating text graphic objects
  createTextNode(e: { clientX: any; clientY: any }) {
    this.nodes.createNode({
      type: 'text',
      x: e.clientX,
      y: e.clientY
    })
    this.keyCommand.unBindEvent()
    this.textEdit.showTextEdit()
  }

  // Mouse scroll event
  onMousewheel(dir: string) {
    if (
      typeof this.state.scrollStep === 'undefined' ||
      typeof this.state.scale === 'undefined'
    ) {
      return
    }
    const stepNum = this.state.scrollStep / this.state.scale
    const step = dir === 'down' ? stepNum : -stepNum
    // @ts-ignore
    this.scrollTo(this.state.scrollX, this.state.scrollY + step)
  }

  // Right-click menu events
  onContextmenu(e: { originEvent: any }) {
    let el: any
    if (this.nodes.hasActiveNode()) {
      el = [this.nodes.activeNode]
    } else if (this.selection.hasSelectionNodes()) {
      el = this.selection.getSelectionNodes()
    }
    this.emit('contextmenu', e.originEvent, el)
  }

  unBindEvent() {
    this.keyCommand.unBindEvent()
  }

  bindEvent() {
    this.keyCommand.bindEvent()
  }

  emitNodeRotateChange(rotate: number) {
    this.emit('nodeRotateChange', rotate)
  }

  // Triggering update events
  emitChange(noDiffData?: boolean, noHistory?: boolean) {
    const data = this.getData()
    const oldData = this.history.now()
    if (
      (typeof oldData === 'undefined' && data.nodes.length !== 0) ||
      (typeof oldData !== 'undefined' && !noHistory)
    ) {
      this.history.add(<LocalData>data)
    }
    if (!noDiffData) {
      if (typeof oldData === 'undefined' && typeof data === 'undefined') {
        return
      }
      if (data && oldData && 'nodes' in data && 'nodes' in oldData) {
        this.emitDiffNodesChange(oldData.nodes, data.nodes)
      }
      if (data && oldData && 'state' in data && 'state' in oldData) {
        this.emitDiffStateChange(oldData.state, data.state)
      }
    }
    this.emit('change', data)
  }

  // Customised data object update triggers with diff algorithm processing
  emitDiffNodesChange(oldNodes: NodeArray, nowNodes: NodeArray) {
    const delta = diff(oldNodes, nowNodes)
    if (delta) {
      this.emit('diffNodesChange', { type: 'diffNodesChange', delta })
    }
  }

  // Customised data state update triggers with diff algorithm processing
  emitDiffStateChange(oldState: State, nowState: State) {
    const delta = diff(oldState, nowState)
    if (delta) {
      this.emit('diffNodesChange', { type: 'diffStateChange', delta })
    }
  }

  async parseSetDiffData(config: { type: string; delta: any }) {
    const oldData = this.getData()
    if (config.type === 'diffNodesChange') {
      this.setData(
        { state: oldData.state, nodes: patch(oldData, config.delta) },
        true,
        true
      )
    } else if (config.type === 'diffStateChange') {
      this.setData(
        { state: patch(oldData, config.delta), nodes: oldData.nodes },
        true,
        true
      )
    }
  }
}

CreatLoader.utils = utils
CreatLoader.checkClick = checkClick
CreatLoader.plot = plot
CreatLoader.nodes = nodes

export default CreatLoader
