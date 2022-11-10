import { Ctx } from '../types';
export declare const plotWrap: (ctx: Ctx, fn: any, fill?: boolean) => void;
export declare const plotCircle: (ctx: Ctx, x: number, y: number, r: number, fill?: boolean) => void;
export declare const plotArrow: (ctx: Ctx, coordinateArr: any[]) => void;
export declare const plotRect: (ctx: Ctx, x: number, y: number, width: number, height: number, fill?: boolean) => void;
export declare const plotDiamond: (ctx: Ctx, x: number, y: number, width: number, height: number, fill?: boolean) => void;
export declare const plotLineSegment: (ctx: Ctx, mx: number, my: number, tx: number, ty: number, lineWidth?: number) => void;
export declare const plotTriangle: (ctx: Ctx, x: number, y: number, width: number, height: any, fill?: boolean) => void;
export declare const plotArbitraryLine: (ctx: Ctx, coordinates: string | any[], opt: any) => void;
export declare const plotText: (ctx: Ctx, textObj: any, x: number, y: number) => void;
export declare const plotImage: (ctx: Ctx, node: any, x: number, y: number, width: number, height: number) => void;
export declare const plotLine: (ctx: Ctx, coordinates: any[]) => void;