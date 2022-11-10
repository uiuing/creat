import BaseNode from '../support/BaseNode';
import { AppObject } from '../types';
export default class Diamond extends BaseNode {
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): any;
    getEndCoordinateList(): {
        x: number;
        y: number;
    }[];
    render(): void;
}
