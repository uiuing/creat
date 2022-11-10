import { AppObject, LocalData } from '../types';
export default class History {
    app: AppObject;
    historyStack: Array<LocalData>;
    length: number;
    index: number;
    fixIndex: number;
    constructor(app: AppObject);
    emitChange(): void;
    now(): LocalData;
    clear(): void;
    add(data: LocalData): void;
    shuttle(): void;
    undo(): void;
    redo(): void;
}
