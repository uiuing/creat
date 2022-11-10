export type Ctx = CanvasRenderingContext2D

export type AppObject = {
  background?: any
  canvas?: any
  calculate?: any
  cursor?: any
  nodes?: any
  event?: any
  export?: any
  grid?: any
  history?: any
  imageEdit?: any
  keyCommand?: any
  author?: any
  render?: any
  selection?: any
  textEdit?: any
  cancelActiveNode: () => void
  checkIsOnNode: () => void
  copyCurrentNode: () => void
  copyNode: () => void
  copyPasteCurrentNodes: () => void
  ctx: Ctx
  cutCurrentNode: () => void
  deleteActiveNode: () => void
  deleteCurrentNodes: () => void
  deleteNode: () => void
  plotType: PlotType
  empty: () => void
  exportImage: (options: {
    type: string
    renderBg: boolean
    useBlob: Blob
    paddingX: number
    paddingY: number
    onlySelected: boolean
  }) => string
  exportJson: () => LocalData
  fit: () => void
  height: number
  hideGrid: () => void
  left: number
  mountEL: HTMLElement | HTMLDivElement
  opts: LoaderOptions
  pasteCurrentNode: () => void
  redo: () => void
  scrollTo: (x: number, y: number) => void
  scrollToCenter: () => void
  selectAll: () => void
  setActiveNodeStyle: (style: Style) => void
  setBackgroundColor: (style: Style) => void
  setCurrentNodesStyle: (style: Style) => void
  setEditAuthor: () => void
  setReadonlyAuthor: () => void
  setSelectedNodeStyle: (style: Style) => void
  setZoom: (zoom: number) => void
  showGrid: () => void
  state: State
  top: number
  undo: () => void
  updateActiveNodePosition: (x: number, y: number) => void
  updateActiveNodeRotate: (rotate: number) => void
  updateActiveNodeSize: (width: number, height: number) => void
  updateGrid: (grid: GridConfig) => void
  width: number
  zoomIn: (num?: number) => void
  zoomOut: (num?: number) => void
  emit: (event: string, ...args: any[]) => void
  on: (event: string, fn: (...args: any[]) => void, ...args: any) => void
  emitChange: () => void
  getData: () => LocalData
  // TODO: fix this type
  updateState: (state: any) => void
  setData: (data: LocalData, noEmitChange: boolean) => Promise<void>
  emitDiffNodesChange: (oldData: LocalData, newData: LocalData) => void
  emitDiffStateChange: (oldData: LocalData, newData: LocalData) => void
}

export type AppResponse = {
  mount: (el: HTMLElement | HTMLDivElement) => AppResponse
  undo: () => void
  redo: () => void
  empty: () => void
  zoomIn: (num?: number) => void
  zoomOut: (num?: number) => void
  setZoom: (zoom: number) => void
  cancelActiveNode: () => void
  updateCurrentType: (type: PlotType) => void
  deleteCurrentNodes: () => void
  copyPasteCurrentNodes: () => void
  setCurrentNodesStyle: (style: Record<string, string | number>) => void
  unBindEvent: () => void
  bindEvent: () => void
  updateActiveNodeRotate: (rotate: number) => void
  watch: {
    zoomChange: (callback: (zoom: number) => void) => void
    scrollChange: (callback: (scroll: { x: number; y: number }) => void) => void
    currentTypeChange: (callback: (type: PlotType) => void) => void
    shuttle: (callback: (index: number, length: number) => void) => void
    activeNodeChange: (callback: (activeNode: object) => void) => void
    multiplexSelectChange: (
      callback: (selectedNodeList: object) => void
    ) => void
    contextmenu: (callback: (event: Event, nodes: object) => void) => void
    diffNodesChange: (callback: (diffNodes: object) => void) => void
    diffStateChange: (callback: (diffState: State) => void) => void
    nodeRotateChange: (callback: (rotate: number) => void) => void
    nodeSizeChange: (callback: (width: number, height: number) => void) => void
    nodePositionChange: (callback: (x: number, y: number) => void) => void
    localDataChange: (callback: (localData: LocalData) => void) => void
  }
  setData: (data: LocalData, noEmitChange: boolean) => void
  getData: () => LocalData
  setEditAuthor: () => void
  setReadonlyAuthor: () => void
  showGrid: () => void
  hideGrid: () => void
  exportImage: (options: {
    type: string
    renderBg: boolean
    useBlob: Blob
    paddingX: number
    paddingY: number
    onlySelected: boolean
  }) => string
  exportJson: () => LocalData
  copyNode: () => void
  resize: () => void
  setBackgroundColor: (color: string) => void
  scrollToCenter: () => void
  utils: {
    downloadFile: (data: string, filename: string) => void
  }
  parseSetDiffData: (config: DiffNodesRes | DiffStateRes) => void
  cancelSelectNodes: () => void
}

export type LoaderOptions = {
  mountEL: HTMLElement | HTMLDivElement
  plotType?: PlotType
  strokeStyle?: string
  state?: State
}

export type PlotType =
  | 'selection'
  | 'rectangle'
  | 'diamond'
  | 'triangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'arbitrary-plot'
  | 'text'
  | 'image'
  | 'eraser'

export type Style =
  | {
      strokeStyle?: string
      fillStyle?: string
      lineWidth?: string | number
      lineDash?: number
      globalAlpha?: number
      fontFamily?: string
      fontSize?: string | number
      lineHeightRatio?: number
    }
  | Record<string, any>

export type NodeArray = Array<Node>

export type Node = {
  app?: AppObject
  dragNode?: Node
  id?: string
  coordinateArr?: Array<Array<number>>
  type: string
  width: number
  height: number
  x: number
  y: number
  rotate?: number
  style?: Style
  isActive?: boolean
  isCreate?: boolean
  isSelected?: boolean
  startX?: number
  startY?: number
  noRender?: boolean
  key?: number
  startRotate?: number
  url?: string
  text?: string
  ratio?: number
  isClick?: (x: number, y: number) => boolean
  render?: any
  resizeType?: string
  lockRatio?: boolean
  serialize?: () => Node
  imageObj?: HTMLInputElement
  startResize?: (...args: any) => void
  resize?: (...args: any) => void
  updateSize?: (width: number, height: number) => Node
  lastLineWidth?: number
  addCoordinate?: (x: number, y: number, ...args: any) => void
  singleRender?: (
    mx: number,
    my: number,
    tx: number,
    ty: number,
    lineWidth: number
  ) => void
  updateFictitiousCoordinate?: (x: number, y: number) => void
  isSingle?: boolean
  removeChild?: (child: Node) => void
  updateMultiplexCoordinateBoundingRect?: () => Node
  checkCoordinateInDragNodeWhere?: (x: number, y: number) => string
  endResize?: () => void
  getEndCoordinateList?: () => any
  rotateByCenter?: (rotate: number, cx: number, cy: number) => void
}

export type State = {
  scale?: number
  scrollX?: number
  scrollY?: number
  scrollStep?: number
  backgroundColor?: string
  showGrid?: boolean
  readonly?: boolean
  defaultColor?: string
  gridColor?: string
  gridConfig?: GridConfig
  plotType: PlotType
}

export type AppState = {
  plotType: PlotType
  scale?: number
  scrollX?: number
  scrollY?: number
  scrollStep?: number
  backgroundColor?: string
  showGrid?: boolean
  readonly?: boolean
  defaultColor?: string
  gridColor?: string
  gridConfig?: GridConfig
}

type GridConfig = {
  size?: number
  strokeStyle?: string
  lineWidth?: number
}

export type LocalData = {
  nodes: NodeArray
  state: State
}

export type KeyPosit = {
  Left: number
  Alt: number
  Insert: number
  CapsLock: number
  Cmd: number
  Shift: number
  Space: number
  PageUp: number
  "'": number
  F1: number
  '+': number
  F2: number
  F3: number
  '-': number
  F4: number
  '.': number
  F5: number
  '/': number
  '0': number
  F6: number
  '1': number
  F7: number
  '2': number
  F8: number
  '3': number
  F9: number
  '4': number
  '5': number
  '6': number
  '7': number
  '8': number
  Enter: number
  '9': number
  CmdFF: number
  End: number
  Up: number
  '=': number
  Backspace: number
  NumLock: number
  Right: number
  Control: number
  Esc: number
  Home: number
  '`': number
  a: number
  Down: number
  b: number
  c: number
  F10: number
  d: number
  e: number
  F12: number
  f: number
  F11: number
  g: number
  h: number
  i: number
  Del: number
  j: number
  k: number
  l: number
  m: number
  n: number
  o: number
  p: number
  q: number
  r: number
  s: number
  Tab: number
  t: number
  u: number
  v: number
  w: number
  x: number
  y: number
  z: number
  PageDown: number
}

export type OnCallBack = (...args: any[]) => void

export type DiffNodesRes = {
  type: 'add' | 'delete' | 'update' | 'cover-all' | 'delete-all'
  nodes: NodeArray
}

export type DiffStateRes = {
  type: 'update-state'
  state: State
}

export type Mount = (mountEl: string | Object | HTMLElement) => AppResponse
export type creatLoader = (state: AppState) => Mount
