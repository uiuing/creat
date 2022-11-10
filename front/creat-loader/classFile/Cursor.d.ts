import { AppObject } from '../types';
export default class Cursor {
    app: AppObject;
    currentType: string;
    constructor(app: AppObject);
    set(type?: string): void;
    setEraser(): void;
    setText(): void;
    setMove(): void;
    hide(): void;
    reset(): void;
    setCrossHair(): void;
    setResize(direction: string): void;
}
