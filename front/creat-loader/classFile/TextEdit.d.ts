import EventEmitter from 'eventemitter3';
import { AppObject } from '../types';
export default class TextEdit extends EventEmitter {
    private readonly app;
    private editable;
    isEditing: boolean;
    constructor(app: AppObject);
    showTextEdit(): void;
    onTextInput(): void;
    onTextBlur(): void;
    crateTextInputEl(): void;
    updateTextInputStyle(): void;
}
