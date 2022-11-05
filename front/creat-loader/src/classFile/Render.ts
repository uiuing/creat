import { getMultiplexNodeRectInfo } from '../common/utils'
import { AppObject } from '../types'

export default class Render {
  public app: AppObject

  public beingCopyActiveNode: null

  public beingCopySelectedNodes: any[]

  public beingCopyNode: undefined

  constructor(app: AppObject) {
    this.app = app

    // The active graphic object that will be copied
    this.beingCopyActiveNode = null

    // The selected graphic object that will be copied
    this.beingCopySelectedNodes = []

    this.registerShortcutKeys()
  }

  // Styling of active graphic objects
  setActiveNodeStyle(style = {}) {
    if (!this.app.nodes.hasActiveNode()) {
      return this
    }
    this.app.nodes.setActiveNodeStyle(style)
    this.render()
    if (!this.app.nodes.isCreateNode) {
      this.app.emitChange()
    }
    return this
  }

  // Set the style for the currently active or selected graphic object
  setCurrentNodesStyle(style = {}) {
    this.setActiveNodeStyle(style)
    this.app.selection.setSelectedNodeStyle(style)
  }

  clearCanvas() {
    const { width, height } = this.app
    this.app.ctx.clearRect(-width / 2, -height / 2, width, height)
    return this
  }

  render() {
    const { state } = this.app
    this.clearCanvas()
    this.app.ctx.save()
    this.app.ctx.scale(<number>state.scale, <number>state.scale)
    this.app.nodes.nodeList.forEach((node: any) => {
      if (node.noRender) {
        return
      }
      node.render()
    })
    this.app.ctx.restore()
    return this
  }

  registerShortcutKeys() {
    // Select all
    this.app.keyCommand.addShortcut('Control+a', () => {
      this.selectAll()
    })
    // Resetting scaling
    this.app.keyCommand.addShortcut('Control+0', () => {
      this.setZoom(1)
    })
    // Delete the currently active graphic object
    this.app.keyCommand.addShortcut('Del|Backspace', () => {
      this.deleteCurrentNodes()
    })
    // Copying graphic objects
    this.app.keyCommand.addShortcut('Control+c', () => {
      this.copyCurrentNode()
    })
    // Cutting graphic objects
    this.app.keyCommand.addShortcut('Control+x', () => {
      this.cutCurrentNode()
    })
    // Withdrawn
    this.app.keyCommand.addShortcut('Control+z', () => {
      this.app.history.undo()
    })
    // Show or hide the grid
    this.app.keyCommand.addShortcut("Control+'", () => {
      if (this.app.state.showGrid) {
        this.app.grid.hideGrid()
      } else {
        this.app.grid.showGrid()
      }
    })
    // Redo
    this.app.keyCommand.addShortcut('Control+y', () => {
      this.app.history.redo()
    })
    // Paste graphic objects
    this.app.keyCommand.addShortcut('Control+v', () => {
      this.pasteCurrentNode(true)
    })
    // Enlarge
    this.app.keyCommand.addShortcut('Control++', () => {
      this.zoomIn()
    })
    // Reduction
    this.app.keyCommand.addShortcut('Control+-', () => {
      this.zoomOut()
    })
    // Scaling to fit all graphic objects
    this.app.keyCommand.addShortcut('Shift+1', () => {
      this.fit()
    })
  }

  // Copy the currently active or selected graphic object
  copyCurrentNode() {
    if (this.app.nodes.activeNode) {
      this.beingCopySelectedNodes = []
      this.beingCopyNode = this.app.nodes.activeNode
    } else if (this.app.selection.hasSelectionNodes()) {
      this.beingCopyNode = undefined
      this.beingCopySelectedNodes = this.app.selection.getSelectionNodes()
    }
  }

  // Cuts the currently active or selected graphic object
  cutCurrentNode() {
    if (this.app.nodes.activeNode) {
      this.copyCurrentNode()
      this.deleteCurrentNodes()
    } else if (this.app.selection.hasSelectionNodes()) {
      this.copyCurrentNode()
      this.deleteCurrentNodes()
      this.app.selection.setMultiplexSelectNodes(this.beingCopySelectedNodes)
      this.app.selection.emitChange()
    }
  }

  // Paste the copied or cut graphic object
  pasteCurrentNode(useCurrentEventPos = false) {
    let pos = null
    if (useCurrentEventPos) {
      const { x } = this.app.event.lastMousePos
      const { y } = this.app.event.lastMousePos
      pos = {
        x,
        y
      }
    }
    if (this.beingCopyNode) {
      this.copyNode(this.beingCopyNode, false, pos as any).then(() => {})
    } else if (this.beingCopySelectedNodes.length > 0) {
      this.app.selection.copySelectionNodes(useCurrentEventPos ? pos : null)
    }
  }

  // Deleting graphic objects
  deleteNode(node: any) {
    this.app.nodes.deleteNode(node)
    this.render()
    this.app.emitChange()
  }

  // Copy and paste graphic objects
  async copyNode(node: any, notActive?: boolean, pos?: { x: any; y: any }) {
    this.app.nodes.cancelActiveNode()
    await this.app.nodes.copyNode(node, notActive, pos)
    this.render()
    this.app.emitChange()
  }

  // Delete the currently active graphic object
  deleteActiveNode() {
    if (!this.app.nodes.hasActiveNode()) {
      return
    }
    this.deleteNode(this.app.nodes.activeNode)
  }

  // Delete the currently active or selected graphic object
  deleteCurrentNodes() {
    this.deleteActiveNode()
    this.app.selection.deleteSelectedNodes()
  }

  // Cancel the currently active graphic object
  cancelActiveNode() {
    if (!this.app.nodes.hasActiveNode()) {
      return this
    }
    this.app.nodes.cancelActiveNode()
    this.render()
    return this
  }

  // Update the position of the currently active graphic object
  updateActiveNodePosition(x: number, y: number) {
    if (!this.app.nodes.hasActiveNode()) {
      return this
    }
    this.app.nodes.activeNode.updatePos(x, y)
    this.render()
    return this
  }

  // Update the size of the currently active graphic object
  updateActiveNodeSize(width: number, height: number) {
    if (!this.app.nodes.hasActiveNode()) {
      return this
    }
    this.app.nodes.activeNode.updateSize(width, height)
    this.render()
    return this
  }

  // Update the rotation angle of the currently active graphic object
  updateActiveNodeRotate(rotate: number) {
    if (!this.app.nodes.hasActiveNode()) {
      return this
    }
    this.app.nodes.activeNode.updateRotate(rotate)
    this.render()
    return this
  }

  // Emptying a graphic object
  empty() {
    this.app.nodes.deleteAllNodes()
    this.render()
    this.app.history.clear()
    this.app.emitChange()
  }

  // Enlarge
  zoomIn(num = 0.1) {
    if (this.app.state.scale) {
      this.app.updateState({
        scale: this.app.state.scale + num
      })
      this.render()
      this.app.emit('zoomChange', this.app.state.scale)
    }
  }

  // Reduction
  zoomOut(num = 0.1) {
    if (this.app.state.scale) {
      this.app.updateState({
        scale: this.app.state.scale - num > 0 ? this.app.state.scale - num : 0
      })
      this.render()
      this.app.emit('zoomChange', this.app.state.scale)
    }
  }

  // Set the specified zoom value
  setZoom(zoom: number) {
    if (zoom < 0 || zoom > 1) {
      return
    }
    this.app.updateState({
      scale: zoom
    })
    this.render()
    this.app.emit('zoomChange', this.app.state.scale)
  }

  // Scaling to fit all graphic objects
  fit() {
    if (!this.app.nodes.hasNodes()) {
      return
    }
    this.scrollToCenter()
    const { minX, maxX, minY, maxY } = getMultiplexNodeRectInfo(
      this.app.nodes.nodeList
    )
    const width = maxX - minX
    const height = maxY - minY
    const maxScale = Math.min(this.app.width / width, this.app.height / height)
    this.setZoom(maxScale)
  }

  // Scroll to the specified position
  scrollTo(scrollX: number, scrollY: number) {
    this.app.updateState({
      scrollX,
      scrollY
    })
    this.render()
    this.app.emit(
      'scrollChange',
      this.app.state.scrollX,
      this.app.state.scrollY
    )
  }

  // Scroll to centre, i.e. back to the centre of all graphic objects
  scrollToCenter() {
    if (!this.app.nodes.hasNodes()) {
      this.scrollTo(0, 0)
      return
    }
    const { minX, maxX, minY, maxY } = getMultiplexNodeRectInfo(
      this.app.nodes.nodeList
    )
    const width = maxX - minX
    const height = maxY - minY
    this.scrollTo(
      minX - (this.app.width - width) / 2,
      minY - (this.app.height - height) / 2
    )
  }

  // Copy and paste the current graphic object
  copyPasteCurrentNodes() {
    this.copyCurrentNode()
    this.pasteCurrentNode()
  }

  // Set the background colour
  setBackgroundColor(color: string) {
    this.app.updateState({
      backgroundColor: color
    })
    this.app.background.set()
  }

  // Select all graphic objects
  selectAll() {
    this.app.selection.selectNodes(this.app.nodes.nodeList)
  }
}
