import EventEmitter from 'eventemitter3'

import { getFontString, getTextNodeSize } from '../common/utils'
import { AppObject } from '../types'

export default class TextEdit extends EventEmitter {
  private readonly app: AppObject

  private editable: undefined | HTMLTextAreaElement

  isEditing: boolean

  constructor(app: AppObject) {
    super()
    this.app = app
    this.editable = undefined
    this.isEditing = false
    this.onTextInput = this.onTextInput.bind(this)
    this.onTextBlur = this.onTextBlur.bind(this)
  }

  // Show text edit box
  showTextEdit() {
    if (!this.editable) {
      this.crateTextInputEl()
    } else {
      this.editable.style.display = 'block'
    }
    if (typeof this.editable === 'undefined') {
      return
    }
    this.updateTextInputStyle()
    this.editable.focus()
    this.editable.select()
    this.isEditing = true
  }

  // Text input events
  onTextInput() {
    const { activeNode } = this.app.nodes
    if (!activeNode) {
      return
    }
    if (typeof this.editable === 'undefined') {
      return
    }
    activeNode.text = this.editable.value
    const { width, height } = getTextNodeSize(activeNode)
    activeNode.width = width
    activeNode.height = height
    this.updateTextInputStyle()
  }

  // Text box out-of-focus event
  onTextBlur() {
    if (typeof this.editable === 'undefined') {
      return
    }
    this.editable.style.display = 'none'
    this.editable.value = ''
    this.emit('blur')
    this.isEditing = false
  }

  // Create text input box graphic objects
  crateTextInputEl() {
    this.editable = document.createElement('textarea')
    this.editable.dir = 'auto'
    this.editable.tabIndex = 0
    this.editable.wrap = 'off'
    this.editable.className = 'textInput'
    Object.assign(this.editable.style, {
      position: 'fixed',
      display: 'block',
      minHeight: '1em',
      backfaceVisibility: 'hidden',
      margin: 0,
      padding: 0,
      border: 0,
      outline: 0,
      resize: 'none',
      background: 'transparent',
      overflow: 'hidden',
      whiteSpace: 'pre'
    })
    this.editable.addEventListener('input', this.onTextInput)
    this.editable.addEventListener('blur', this.onTextBlur)
    document.body.appendChild(this.editable)
  }

  // Update the style of the text input box according to the style of the current text graphic object
  updateTextInputStyle() {
    const { activeNode } = this.app.nodes
    if (!activeNode) {
      return
    }
    if (typeof this.editable === 'undefined') {
      return
    }
    let { x, y }: any = activeNode
    const { width, height, style, text, rotate }: any = activeNode
    const { calculate, state } = this.app
    this.editable.value = text
    x = calculate.subScrollX(x)
    y = calculate.subScrollY(y)
    if (typeof state.scale === 'undefined') {
      return
    }
    // Screen coordinates to canvas coordinates
    const sp = calculate.scale(x, y)
    const tp = calculate.mountELToWindow(sp.x, sp.y)
    const fontSize = style.fontSize * state.scale
    const styles = {
      font: getFontString(fontSize, style.fontFamily),
      lineHeight: `${fontSize * style.lineHeightRatio}px`,
      left: `${tp.x}px`,
      top: `${tp.y}px`,
      color: style.fillStyle,
      width: `${Math.max(width, 100) * state.scale}px`,
      height: `${height * state.scale}px`,
      transform: `rotate(${rotate}deg)`,
      opacity: style.globalAlpha
    }
    Object.assign(this.editable.style, styles)
  }
}
