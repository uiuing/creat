import { AppObject } from '../../types';
export default class Calculate {
    private readonly app;
    constructor(app: AppObject);
    transformToCanvasCalculate(x: number, y: number): {
        x: number;
        y: number;
    };
    gridAdsorbent(x: number, y: number): {
        x?: undefined;
        y?: undefined;
    } | {
        x: number;
        y: number;
    };
    addScrollY(y: number): number;
    addScrollX(x: number): number;
    subScrollY(y: number): number;
    subScrollX(x: number): number;
    transformToScreenCalculate(x: number, y: number): {
        x: number;
        y: number;
    };
    transform(x: number, y: number): {
        x: number;
        y: number;
    };
    mountELToWindow(x: number, y: number): {
        x: number;
        y: number;
    };
    windowToContainer(x: number, y: number): {
        x: number;
        y: number;
    };
    scale(x: number, y: number): {
        x?: undefined;
        y?: undefined;
    } | {
        x: number;
        y: number;
    };
    reverseScale(x: number, y: number): {
        x?: undefined;
        y?: undefined;
    } | {
        x: number;
        y: number;
    };
}
