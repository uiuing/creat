import {
  getMultiplexNodeRectInfo,
  getNodeCenterCoordinate,
  getTowCoordinateRotate
} from '../common/utils'
import BaseNode from '../support/BaseNode'
import DragNode from '../support/DragNode'
import { AppObject, Node, NodeArray } from '../types'

export default class MultiplexSelectNode extends BaseNode {
  selectedNodeList: NodeArray

  public wholeCenterPos: { x: number; y: number }

  constructor(options: Node, app: AppObject) {
    super(options, app)

    this.dragNode = new DragNode(this as any, this.app)

    this.selectedNodeList = []

    this.wholeCenterPos = { x: 0, y: 0 }
  }

  // Filtering out deleted graphic objects
  updateNodes(nodes: NodeArray) {
    const exists: NodeArray = []
    this.selectedNodeList.forEach((node) => {
      if (nodes.includes(node)) {
        exists.push(node)
      }
    })
    this.setSelectedNodeList(exists)
  }

  // Calculate size and position
  // @ts-ignore
  updateRect() {
    if (this.selectedNodeList.length <= 0) {
      super.updateRect(0, 0, 0, 0)
      return
    }
    const { minX, maxX, minY, maxY } = getMultiplexNodeRectInfo(
      this.selectedNodeList
    )
    super.updateRect(minX, minY, maxX - minX, maxY - minY)
  }

  // In adjustment
  // @ts-ignore
  resize(...args: any) {
    this.selectedNodeList.forEach((node: Node) => {
      if (node.dragNode && node.dragNode.resizeType === 'rotate') {
        // 旋转操作特殊处理
        this.handleRotate(node, ...args)
      } else {
        node?.resize?.(...args)
      }
    })
  }

  // Rotating graphic objects
  handleRotate(node: Node, e?: any, mx?: number, my?: number) {
    const rotate = getTowCoordinateRotate(
      this.wholeCenterPos.x,
      this.wholeCenterPos.y,
      e.clientX,
      e.clientY,
      <number>mx,
      <number>my
    )
    node.rotateByCenter?.(rotate, this.wholeCenterPos.x, this.wholeCenterPos.y)
  }

  // End of adjustment
  // @ts-ignore
  endResize() {
    this.selectedNodeList.forEach((node) => {
      node.endResize?.()
    })
  }

  // Set the selected graphic object list
  setSelectedNodeList(list: NodeArray) {
    this.selectedNodeList.forEach((node) => {
      node.isSelected = false
    })
    this.selectedNodeList = list
    this.selectedNodeList.forEach((node) => {
      node.isSelected = true
    })
  }

  // Start of adjustment
  // @ts-ignore
  startResize(...args: any) {
    this.selectedNodeList.forEach((node) => {
      if (args[0] === 'rotate') {
        // 计算多选图形对象整体中心坐标
        this.wholeCenterPos = getNodeCenterCoordinate(this as any)
      }
      node.startResize?.(...args)
    })
  }

  render() {
    if (this.width && this.height && this.selectedNodeList.length > 0) {
      if (this.width <= 0 || this.height <= 0) {
        return
      }
      this.dragNode.render()
    }
  }
}
