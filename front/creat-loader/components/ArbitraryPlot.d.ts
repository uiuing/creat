import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode';
import { AppObject } from '../types';
export default class ArbitraryPlot extends BaseMultiplexCoordinateNode {
    lastLineWidth: number;
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): null;
    singleRender(mx: number, my: number, tx: number, ty: number, lineWidth: number | undefined): void;
    render(): void;
}
