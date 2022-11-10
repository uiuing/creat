import EventEmitter from 'eventemitter3';
import { AppObject } from '../types';
export default class Event extends EventEmitter {
    app: AppObject;
    calculate: any;
    lastMousePos: {
        x: number;
        y: number;
    };
    mouseDistance: number;
    lastMouseTime: number;
    mouseDuration: number;
    mouseSpeed: number;
    isMousedown: boolean;
    mousedownPos: {
        originClientY: number;
        x: number;
        y: number;
        unGridClientX: number;
        unGridClientY: number;
        originClientX: number;
    };
    mouseOffset: {
        originX: number;
        originY: number;
        x: number;
        y: number;
    };
    constructor(app: AppObject);
    onMouseup(e: any): void;
    onDblclick(e: any): void;
    onMousewheel(e: any): void;
    onContextmenu(e: any): void;
    onKeydown(e: any): void;
    onKeyup(e: any): void;
    onMousedown(e: any): void;
    onMousemove(e: any): void;
    transformEvent(e: {
        clientX: any;
        clientY: any;
    }): {
        originEvent: {
            clientX: any;
            clientY: any;
        };
        unGridClientX: any;
        unGridClientY: any;
        clientX: any;
        clientY: any;
    };
    bindEvent(): void;
    unbindEvent(): void;
}
