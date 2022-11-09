import { AppObject, Ctx } from '../types';
export default class Background {
    app: AppObject;
    constructor(app: AppObject);
    set(): void;
    addBackgroundColor(): void;
    remove(): void;
    static canvasAddBackgroundColor(ctx: Ctx, width: number, height: number, backgroundColor: string): void;
}
