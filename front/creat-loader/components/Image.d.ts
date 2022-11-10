import BaseNode from '../support/BaseNode';
import { AppObject } from '../types';
export default class Image extends BaseNode {
    url: string;
    imageObj: null;
    ratio: number;
    constructor(options: Node, app: AppObject);
    isClick(x: number, y: number): any;
    serialize(): {
        url: string;
        ratio: number;
        id: string;
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
