import { AppObject } from '../types';
import BaseNode from './BaseNode';
export default class BaseMultiplexCoordinateNode extends BaseNode {
    startCoordinateArr: any[];
    coordinateArr: any;
    startWidth: number | undefined;
    startHeight: number | undefined;
    fictitiousCoordinate: {
        x: number;
        y: number;
    };
    constructor(opts: any, app: AppObject);
    updateRect(x: number, y: number, width: number, height: number): this;
    rotateByCenter(rotate: number, cx: number, cy: number): void;
    serialize(): {
        coordinateArr: any[];
        type: string;
        width: number;
        height: number;
        x: number;
        y: number;
        rotate: number;
        style: any;
    };
    getEndCoordinateList(): any;
    addCoordinate(x: number, y: number, ...args: any[]): this | undefined;
    updateMultiplexCoordinateBoundingRect(): this;
    updateFictitiousCoordinate(x: number, y: number): void;
    move(ox: number, oy: number): this;
    saveState(): this;
}
