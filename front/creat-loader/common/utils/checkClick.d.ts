import { Node } from '../../types';
declare type Segments = Array<[x1: number, y1: number, x2: number, y2: number]>;
declare type Rp = {
    xs?: number;
    ys?: number;
    x: number;
    y: number;
};
export declare const checkIsAtRectangleInner: (node: any, rp: Rp) => any;
export declare const getCircleRadius: (width: number, height: number) => number;
export declare const checkIsAtMultiplexSegment: (segments: Segments, rp: Rp) => boolean;
export declare const checkIsAtCircleEdge: (node: any, rp: Rp) => any;
export declare const checkIsAtRectangleEdge: (node: any, rp: Rp) => any;
export declare const checkIsAtTriangleEdge: (node: Node, rp: Rp) => Node | null;
export declare const checkIsAtDiamondEdge: (node: any, rp: Rp) => any;
export declare const checkIsAtArrowEdge: (node: any, rp: Rp) => any;
export declare const checkIsAtArbitraryPlotLineEdge: (node: Node, rp: Rp) => null;
export declare const checkIsAtLineEdge: (node: Node, rp: Rp) => Node | null;
export {};
