import { AppObject } from '../types';
export default class Render {
    app: AppObject;
    beingCopyActiveNode: null;
    beingCopySelectedNodes: any[];
    beingCopyNode: undefined;
    constructor(app: AppObject);
    setActiveNodeStyle(style?: {}): this;
    setCurrentNodesStyle(style?: {}): void;
    clearCanvas(): this;
    render(): this;
    registerShortcutKeys(): void;
    copyCurrentNode(): void;
    cutCurrentNode(): void;
    pasteCurrentNode(useCurrentEventPos?: boolean): void;
    deleteNode(node: any): void;
    copyNode(node: any, notActive?: boolean, pos?: {
        x: any;
        y: any;
    }): Promise<void>;
    deleteActiveNode(): void;
    deleteCurrentNodes(): void;
    cancelActiveNode(): this;
    updateActiveNodePosition(x: number, y: number): this;
    updateActiveNodeSize(width: number, height: number): this;
    updateActiveNodeRotate(rotate: number): this;
    empty(): void;
    zoomIn(num?: number): void;
    zoomOut(num?: number): void;
    setZoom(zoom: number): void;
    fit(): void;
    scrollTo(scrollX: number, scrollY: number): void;
    scrollToCenter(): void;
    copyPasteCurrentNodes(): void;
    setBackgroundColor(color: string): void;
    selectAll(): void;
}
