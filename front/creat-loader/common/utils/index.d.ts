import { Ctx, LocalData, Node, NodeArray, Style } from '../../types';
export declare function getNodeID(): string;
export declare function createNodeKey(): number;
export declare const deepCopy: (obj: LocalData) => any;
export declare const downloadFile: (file: string, fileName: string) => void;
export declare const throttle: (fn: any, ctx: Ctx, time?: number) => (...args: any) => void;
export declare const getFontString: (fontSize: number, fontFamily: string) => string;
export declare const splitTextLines: (text: string) => string[];
export declare const radToDeg: (rad: number) => number;
export declare const degToRad: (deg: number) => number;
export declare const createCanvas: (width: number, height: number, option?: {
    noStyle?: boolean;
    noTranslate?: boolean;
    className?: string;
}) => {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
};
export declare const getTowCoordinateDistance: (x1: number, y1: number, x2: number, y2: number) => number;
export declare const getCoordinateToLineDistance: (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => number;
export declare const checkIsAtSegment: (x: number, y: number, x1: number, y1: number, x2: number | undefined, y2: number | undefined, dis?: number) => boolean;
export declare const getTowCoordinateRotate: (cx: number, cy: number, tx: number, ty: number, fx: number, fy: number) => number;
export declare const getRotatedCoordinate: (x: number, y: number, cx: number, cy: number, rotate: number) => {
    x: number;
    y: number;
};
export declare const getNodeCenterCoordinate: (node: any) => {
    x: any;
    y: any;
};
export declare const transformCoordinateReverseRotate: (x: number, y: number, cx: number, cy: number, rotate: number) => {
    x: number;
    y: number;
};
export declare const transformCoordinateOnNode: (x: number, y: number, node: any) => {
    x: number;
    y: number;
};
export declare const getNodeFourCornerCoordinate: (node: Node, dir: string) => {
    x: any;
    y: any;
} | {
    x?: undefined;
    y?: undefined;
};
export declare const getBoundingRect: (coordinateArr?: never[], returnFourCorners?: boolean) => {
    x: number;
    y: number;
}[] | {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const getNodeRotatedFourCornerCoordinate: (node: Node, dir: string) => 0 | {
    x: number;
    y: number;
};
export declare const checkCoordinateIsInRectangle: (x: number, y: number, rx: number | Node, ry?: number | undefined, rw?: number | undefined, rh?: number | undefined) => boolean;
export declare const getMultiplexNodeRectInfo: (nodeList?: NodeArray) => {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};
export declare const getTextActWidth: (text: string, style: Style) => number;
export declare const getNodeFourCorners: (node: Node) => (number | {
    x: number;
    y: number;
})[];
export declare const createImageObj: (url: string) => Promise<unknown>;
export declare const getMaxFontSizeInWidth: (text: string, width: number, style: {
    fontSize: number;
    fontFamily: string;
}) => number;
export declare const getWrapTextActWidth: (node: Node) => number;
export declare const getWrapTextMaxRowTextNumber: (text: string) => number;
export declare const getTextNodeSize: (node: Node) => {
    width: number;
    height: number;
};
export declare const computedLineWidthBySpeed: (speed: number, lastLineWidth: number, baseLineWidth?: number) => number;
