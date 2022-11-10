import { AppObject } from '../types';
export default class Author {
    app: AppObject;
    startScrollX: number | undefined;
    startScrollY: number | undefined;
    isDragAuthor: boolean;
    constructor(app: AppObject);
    onStart(): void;
    onMove(e: any, event: {
        mouseOffset: {
            originX: number;
            originY: number;
        };
    }): void;
    bindEvent(): void;
    setEditAuthor(): void;
    setReadonlyAuthor(): void;
}
