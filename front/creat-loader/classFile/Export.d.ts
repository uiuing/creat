import { AppObject, Ctx } from '../types';
export default class Export {
    app: AppObject;
    openPreview: boolean;
    saveState: {
        width: number;
        scale: number;
        scrollY: number;
        scrollX: number;
        height: number;
        ctx?: Ctx;
    };
    constructor(app: AppObject);
    exportJson(): import("../types").LocalData;
    render(ctx: Ctx, onlySelected: boolean): void;
    saveAppState(): void;
    exportImage({ type, renderBg, useBlob, paddingX, paddingY, onlySelected }?: {
        type?: string | undefined;
        renderBg?: boolean | undefined;
        useBlob?: boolean | undefined;
        paddingX?: number | undefined;
        paddingY?: number | undefined;
        onlySelected?: boolean | undefined;
    }): string | Promise<unknown>;
    show(canvas: HTMLCanvasElement): void;
    recoveryAppState(): void;
    changeAppState(minX: number, minY: number, ctx: Ctx): void;
    getNodeList(onlySelected?: boolean): any;
}
