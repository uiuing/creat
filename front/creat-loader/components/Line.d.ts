import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode';
import { AppObject } from '../types';
export default class Line extends BaseMultiplexCoordinateNode {
    isSingle: boolean;
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): import("../types").Node | null;
    render(): void;
}
