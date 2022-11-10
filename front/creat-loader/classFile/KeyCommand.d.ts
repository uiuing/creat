import { AppObject, KeyPosit } from '../types';
export default class KeyCommand {
    app: AppObject;
    keyPosit: KeyPosit;
    shortcutMap: any;
    constructor(app: AppObject);
    getKeyCodeArr(key: string): any[];
    getOriginEventCodeArr(e: {
        stopPropagation?: () => void;
        preventDefault?: () => void;
        ctrlKey?: any;
        metaKey?: any;
        altKey?: any;
        shiftKey?: any;
        keyCode?: any;
    }): any[];
    checkKey(e: {
        stopPropagation: () => void;
        preventDefault: () => void;
    }, key: string): boolean;
    onKeydown(e: {
        stopPropagation: () => void;
        preventDefault: () => void;
    }): void;
    addShortcut(key: string, fn: any, ctx?: any): void;
    removeShortcut(key: string, fn: any): void;
    bindEvent(): void;
    unBindEvent(): void;
}
