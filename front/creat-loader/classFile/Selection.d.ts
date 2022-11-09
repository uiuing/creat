import Calculate from '../common/utils/Calculate';
import MultiplexSelectNode from '../components/MultiplexSelectNode';
import Rectangle from '../components/Rectangle';
import { AppObject, Ctx, NodeArray, State } from '../types';
export default class Selection {
    app: AppObject;
    canvas: any;
    ctx: Ctx | undefined;
    createSelection: boolean;
    hasSelection: boolean;
    isResize: boolean;
    state: State;
    width: number;
    height: number;
    calculate: Calculate;
    rectangle: Rectangle;
    multiplexSelectNode: MultiplexSelectNode;
    constructor(app: AppObject);
    checkInNodes(e: any, event: any): void;
    checkInResizeHand(x: any, y: any): any;
    deleteSelectedNodes(): void;
    hasSelectionNodes(): boolean;
    getSelectionNodes(): NodeArray;
    copySelectionNodes(pos: {
        x: number;
        y: number;
    }): Promise<void>;
    checkIsResize(x: number, y: number, e: any): boolean;
    handleResize(...args: any[]): void;
    endResize(): void;
    setSelectedNodeStyle(style?: {}): void;
    selectNodes(nodes?: never[]): void;
    cancelSelectNodes(): void;
    setMultiplexSelectNodes(nodes?: NodeArray, notUpdateRect?: boolean): void;
    emitChange(): void;
    bindEvent(): void;
    onMousedown(e: {
        originEvent: {
            which: number;
        };
    }, event: {
        mousedownPos: {
            x: number;
            y: number;
        };
    }): void;
    onMousemove(e: number, event: {
        mouseOffset: {
            x: number;
            y: number;
        };
    }): void;
    onMouseup(): void;
    onMove(e: number, event: {
        mouseOffset: {
            x: number;
            y: number;
        };
    }): void;
    reset(): void;
    renderSelection(): void;
    init(): void;
}
