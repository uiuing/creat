import { AppObject, Node } from '../types';
import BaseNode from './BaseNode';
export default class DragNode extends BaseNode {
    options: Node;
    node: any;
    offset: number;
    size: number;
    resizeType: string;
    diagonalCoordinate: {
        x: number;
        y: number;
    };
    mousedownPosAndNodePosOffset: {
        x: number;
        y: number;
    };
    nodeRatio: number;
    hideParts: any[];
    constructor(node: any, app: AppObject, options?: {});
    startResize(resizeType: string, e: any): void;
    endResize(): void;
    handleDragMousedown(e: {
        clientX: number;
        clientY: number;
    }, corner: string): void;
    handleResizeNode(e: any, mx: number, my: number, offsetX: number, offsetY: number): void;
    handleMoveNode(offsetX: number, offsetY: number): void;
    handleRotateNode(e: {
        clientX: number;
        clientY: number;
    }, mx: number, my: number): void;
    setHideParts(parts?: never[]): void;
    showAll(): void;
    onlyShowBody(): void;
    update(): void;
    stretchCalc(x: number, y: number, calcSize: (arg0: {
        x: number;
        y: number;
    }, arg1: {
        x: number;
        y: number;
    }) => any, calcPos: (arg0: {
        x: number;
        y: number;
    }, arg1: any) => any): {
        newRect: {
            x: any;
            y: any;
            width: any;
            height: any;
        };
        newCenter: {
            x: number;
            y: number;
        };
    };
    handleStretchNode(e: {
        clientX: number;
        clientY: number;
    }, calcSize: any, calcPos: any, fixPos: any): void;
    fixStretch(newRect: {
        x?: any;
        y?: any;
        width: any;
        height: any;
    }, newCenter: {
        x: any;
        y: any;
    }, calcSize: {
        (newCenter: {
            x: number;
            y: number;
        }, rp: {
            x: number;
            y: number;
        }): {
            width: number;
            height: number;
        };
        (newCenter: {
            x: number;
            y: number;
        }, rp: {
            x: number;
            y: number;
        }): {
            width: number;
            height: number;
        };
        (newCenter: {
            x: number;
            y: number;
        }, rp: {
            x: number;
            y: number;
        }): {
            width: number;
            height: number;
        };
        (newCenter: {
            x: number;
            y: number;
        }, rp: {
            x: number;
            y: number;
        }): {
            width: number;
            height: number;
        };
        (arg0: {
            x: number;
            y: number;
        }, arg1: {
            x: number;
            y: number;
        }): any;
        (arg0: {
            x: number;
            y: number;
        }, arg1: {
            x: number;
            y: number;
        }): any;
    }, calcPos: {
        (rp: {
            x: any;
            y: any;
        }): {
            x: any;
            y: any;
        };
        (rp: {
            x: number;
            y: any;
        }, newSize: {
            width: number;
        }): {
            x: number;
            y: any;
        };
        (rp: {
            x: number;
            y: number;
        }, newSize: {
            width: number;
            height: number;
        }): {
            x: number;
            y: number;
        };
        (rp: {
            x: number;
            y: number;
        }, newSize: {
            height: number;
        }): {
            x: number;
            y: number;
        };
        (arg0: {
            x: number;
            y: number;
        }, arg1: any): any;
        (arg0: {
            x: number;
            y: number;
        }, arg1: any): any;
    }, fixPos: {
        (newRatio: number, newRect: {
            x?: any;
            width?: any;
            height?: any;
            y?: any;
        }): {
            x: any;
            y: any;
        };
        (newRatio: number, newRect: {
            x?: any;
            height?: any;
            width?: any;
            y?: any;
        }): {
            x: any;
            y: any;
        };
        (newRatio: number, newRect: {
            x?: any;
            height?: any;
            y?: any;
            width?: any;
        }): {
            x: any;
            y: any;
        };
        (newRatio: number, newRect: {
            x?: any;
            width?: any;
            height?: any;
            y?: any;
        }): {
            x: any;
            y: any;
        };
        (arg0: number, arg1: any): any;
    }): void;
    render(): void;
    checkCoordinateInDragNodeWhere(x: number, y: number): string;
    _checkCoordinateIsInButton(x: number, y: number, dir: string): boolean;
}
