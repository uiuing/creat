import { Ctx } from '../types';
export default class Canvas {
    width: number;
    height: number;
    el: HTMLCanvasElement | undefined;
    ctx: Ctx | undefined;
    constructor(width: number, height: number, opt?: {
        noStyle?: boolean;
        noTranslate?: boolean;
        className?: string;
    });
    clearCanvas(): void;
}
