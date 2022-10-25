export type GridConfig = {
  size: number
  strokeStyle: string
  lineWidth: number
}

export type State = {
  scale: number
  scrollX: number
  scrollY: number
  scrollStep: number
  backgroundColor: string
  showGrid: boolean
  readonly: boolean
  gridConfig: GridConfig
}

export type CreatLoaderProps = {
  mountDOM: HTMLElement
  shapeType?: string
  state?: State
}
