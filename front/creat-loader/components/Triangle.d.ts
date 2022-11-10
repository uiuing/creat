import BaseNode from '../support/BaseNode';
import { AppObject } from '../types';
export default class Triangle extends BaseNode {
    constructor(options: Node, app: AppObject);
    getEndCoordinateList(): {
        x: number;
        y: number;
    }[];
    isClick(x: number, y: number): import("../types").Node | null;
    render(): void;
}
