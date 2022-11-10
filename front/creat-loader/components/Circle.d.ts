import BaseNode from '../support/BaseNode';
import { AppObject } from '../types';
export default class Circle extends BaseNode {
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): any;
    render(): void;
}
