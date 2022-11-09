import ArbitraryPlot from '../components/ArbitraryPlot';
import Arrow from '../components/Arrow';
import Circle from '../components/Circle';
import Diamond from '../components/Diamond';
import Image from '../components/Image';
import Line from '../components/Line';
import Rectangle from '../components/Rectangle';
import Text from '../components/Text';
import Triangle from '../components/Triangle';
import { AppObject, Ctx, Node, NodeArray, PlotType } from '../types';
export default class Nodes {
    app: AppObject;
    nodeList: NodeArray;
    activeNode: Node | undefined;
    isCreateNode: boolean;
    isResize: boolean;
    resizeNode: Node | null;
    constructor(app: AppObject);
    createNode(options: any, callback?: (...args: any) => void, ctx?: Ctx, notActive?: boolean): this;
    copyNode(node: Node, notActive?: boolean, pos?: {
        x: number;
        y: number;
    }): Promise<any>;
    createRectangleLikeNode(type: PlotType, x: number, y: number, offsetX: number, offsetY: number): void;
    createCircle(x: number, y: number, e: {
        clientX: any;
        clientY: any;
    }): void;
    createArbitraryPlot(e: {
        clientX: any;
        clientY: any;
    }, event: {
        mouseSpeed: number;
        lastMousePos: {
            x: number;
            y: number;
        };
    }): void;
    createImage(e: {
        unGridClientX: number;
        unGridClientY: number;
    }, { width, height, imageObj, url, ratio }: {
        width: number;
        height: number;
        imageObj: HTMLInputElement;
        url: string;
        ratio: number;
    }): void;
    editingText(node: Node): void;
    completeEditingText(): void;
    completeCreateArrow(e: {
        clientX: number;
        clientY: number;
    }): void;
    createArrow(x: number, y: number, e: {
        clientX: any;
        clientY: any;
    }): void;
    createLine(x: number | undefined, y: number | undefined, e: {
        clientX: number;
        clientY: number;
    }, isSingle?: boolean, notCreate?: boolean): void;
    insertNode(node: Node, index: number): void;
    addNode(node: Node): this;
    getNodesNum(): number;
    hasNodes(): boolean;
    unshiftNode(node: Node): this;
    deleteNode(node: Node): this;
    deleteAllNodes(): this;
    getNodeIndex(node: Node): number;
    createNodesFromData(nodes: NodeArray): this;
    hasActiveNode(): Node | undefined;
    setActiveNode(node?: Node): this;
    cancelActiveNode(): this;
    checkIsClickNode(e: any): Node | null;
    pureCreateNode(options?: any): ArbitraryPlot | Arrow | Circle | Diamond | Image | Line | Rectangle | Text | Triangle | null;
    completeCreateLine(e: {
        clientX: number;
        clientY: number;
    }, completeCallback?: () => void): void;
    completeCreateNode(): this;
    setActiveNodeStyle(style?: {}): this;
    checkInResizeHand(x: any, y: any): {
        node: Node | undefined;
        hand: string;
    } | null;
    checkIsResize(x: number, y: number, e: any): boolean;
    handleResize(...args: any[]): void;
    endResize(): void;
    serialize(stringify?: boolean): string | (Node | undefined)[];
}
