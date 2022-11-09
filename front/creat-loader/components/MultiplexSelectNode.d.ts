import BaseNode from '../support/BaseNode';
import { AppObject, Node, NodeArray } from '../types';
export default class MultiplexSelectNode extends BaseNode {
    selectedNodeList: NodeArray;
    wholeCenterPos: {
        x: number;
        y: number;
    };
    constructor(options: Node, app: AppObject);
    updateNodes(nodes: NodeArray): void;
    updateRect(): void;
    resize(...args: any): void;
    handleRotate(node: Node, e?: any, mx?: number, my?: number): void;
    endResize(): void;
    setSelectedNodeList(list: NodeArray): void;
    startResize(...args: any): void;
    render(): void;
}
