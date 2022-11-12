import EventEmitter from 'eventemitter3';
import Author from './classFile/Author';
import Background from './classFile/Background';
import Cursor from './classFile/Cursor';
import Event from './classFile/Event';
import Export from './classFile/Export';
import Grid from './classFile/Grid';
import History from './classFile/History';
import ImageEdit from './classFile/ImageEdit';
import KeyCommand from './classFile/KeyCommand';
import Render from './classFile/Render';
import Selection from './classFile/Selection';
import TextEdit from './classFile/TextEdit';
import Calculate from './common/utils/Calculate';
import { Ctx, DiffNodesRes, DiffStateRes, LocalData, PlotType, State } from './types';
declare type Options = {
    mountEL: HTMLElement | HTMLDivElement;
    plotType?: PlotType;
    state?: State;
};
declare class CreatLoader extends EventEmitter {
    options: Options;
    readonly mountEL: HTMLElement | HTMLDivElement;
    plotType: any;
    width: number;
    height: number;
    left: number;
    top: number;
    canvas: HTMLCanvasElement | undefined;
    ctx: Ctx | undefined;
    state: State;
    calculate: Calculate;
    event: Event;
    keyCommand: KeyCommand;
    imageEdit: ImageEdit;
    textEdit: TextEdit;
    cursor: Cursor;
    history: History;
    export: Export;
    background: Background;
    selection: Selection;
    grid: Grid;
    author: Author;
    nodes: any;
    render: Render;
    watch: any;
    static utils: any;
    static checkClick: any;
    static plot: any;
    static nodes: any;
    oldData: undefined;
    constructor(options: Options);
    mountFunction(): void;
    getData(): {
        state: {
            scale?: number | undefined;
            scrollX?: number | undefined;
            scrollY?: number | undefined;
            scrollStep?: number | undefined;
            backgroundColor?: string | undefined;
            showGrid?: boolean | undefined;
            readonly?: boolean | undefined;
            defaultColor?: string | undefined;
            gridColor?: string | undefined;
            gridConfig?: {
                size?: number | undefined;
                strokeStyle?: string | undefined;
                lineWidth?: number | undefined;
            } | undefined;
            plotType: PlotType;
        };
        nodes: any;
    };
    onImageSelectChange(): void;
    getContainerRectInfo(): void;
    helpUpdate(): void;
    setData({ state, nodes }: any, noEmitChange: boolean, noDiffData?: boolean): Promise<void>;
    initCanvas(): void;
    resize(): void;
    updateState(data?: {}): void;
    updateCurrentType(plotType: PlotType): void;
    onMousedown(e: {
        unGridClientX?: number;
        unGridClientY?: number;
        originEvent?: {
            which: number;
        };
    }, event: {
        mousedownPos: any;
    }): void;
    onMousemove(e: any, event: any): void;
    checkIsOnNode(e: {
        unGridClientX: number;
        unGridClientY: number;
    }): void;
    resetCurrentType(): void;
    completeCreateNewNode(): void;
    onMouseup(e: any): void;
    onDblclick(e: {
        unGridClientX: number;
        unGridClientY: number;
    }): void;
    onTextInputBlur(): void;
    createTextNode(e: {
        clientX: any;
        clientY: any;
    }): void;
    onMousewheel(dir: string): void;
    onContextmenu(e: {
        originEvent: any;
    }): void;
    unBindEvent(): void;
    bindEvent(): void;
    emitNodeRotateChange(rotate: number): void;
    emitChange(noDiffData?: boolean, noHistory?: boolean): void;
    emitDiffNodesChange(oldData: LocalData, nowData: LocalData): void;
    emitDiffStateChange(oldData: LocalData, nowData: LocalData): void;
    parseSetDiffData(config: DiffNodesRes | DiffStateRes): Promise<void>;
}
export default CreatLoader;
