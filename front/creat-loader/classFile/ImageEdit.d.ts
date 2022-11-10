import EventEmitter from 'eventemitter3';
import { AppObject } from '../types';
export default class ImageEdit extends EventEmitter {
    app: AppObject;
    el: HTMLInputElement | null;
    isReady: boolean;
    previewEl: HTMLDivElement | null;
    imageData: {
        url: string;
        width: number;
        height: number;
        ratio: number;
        imageObj: HTMLInputElement;
    } | null;
    maxWidth: number;
    maxHeight: number;
    maxRatio: number;
    constructor(app: AppObject);
    updatePreviewElPos(x: number, y: number): void;
    reset(): void;
    getImageUrl(file: Blob): Promise<unknown>;
    getImageSize(url: string): Promise<{
        imageObj: HTMLInputElement;
        size: {
            width: number;
            height: number;
        };
        ratio: number;
    }>;
    onImageSelectChange(e: any): Promise<void>;
    selectImage(): void;
}
