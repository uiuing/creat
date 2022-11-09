import { AppObject, Ctx } from '../types';
export default class Grid {
    app: AppObject;
    canvas: any;
    ctx: Ctx | null;
    constructor(app: AppObject);
    renderVerticalLines(): void;
    renderHorizontalLines(): void;
    renderGrid(): void;
    plotHorizontalLine(i: number): void;
    plotVerticalLine(i: number): void;
    showGrid(): void;
    hideGrid(): void;
    updateGrid(config?: {}): void;
    init(): void;
}
