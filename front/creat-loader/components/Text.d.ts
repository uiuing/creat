import BaseNode from '../support/BaseNode';
import { AppObject, Node } from '../types';
export default class Text extends BaseNode {
    text: string;
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): any;
    updateRect(x: number, y: number, width: number, height: number): void;
    serialize(): {
        text: string;
        type: string;
        width: number;
        height: number;
        x: number;
        y: number;
        rotate: number;
        style: any;
    };
    render(): void;
}
