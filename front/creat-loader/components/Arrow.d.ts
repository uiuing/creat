import BaseMultiplexCoordinateNode from '../support/BaseMultiplexCoordinateNode';
import { AppObject } from '../types';
export default class Arrow extends BaseMultiplexCoordinateNode {
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): any;
    render(): void;
}
