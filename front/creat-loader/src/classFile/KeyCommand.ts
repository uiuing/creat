import { keyPosit } from '../common/constants'
import { AppObject, KeyPosit } from '../types'

export default class KeyCommand {
  public app: AppObject

  public keyPosit: KeyPosit

  public shortcutMap: any

  constructor(app: AppObject) {
    this.app = app

    this.keyPosit = keyPosit

    this.shortcutMap = {}

    this.bindEvent()
  }

  // Get the array of key values corresponding to the shortcut keys
  getKeyCodeArr(key: string) {
    key = key.replace(/\+\+/, '+add')
    const keyArr = key
      .split(/\s*\+\s*/)
      .map((item) => (item === 'add' ? '+' : item))
    const arr: any[] = []
    keyArr.forEach((item) => {
      // @ts-ignore
      arr.push(keyPosit[item])
    })
    return arr
  }

  // Get an array of key values in an event object
  getOriginEventCodeArr(e: {
    stopPropagation?: () => void
    preventDefault?: () => void
    ctrlKey?: any
    metaKey?: any
    altKey?: any
    shiftKey?: any
    keyCode?: any
  }) {
    const arr = []
    if (e.ctrlKey || e.metaKey) {
      arr.push(keyPosit.Control)
    }
    if (e.altKey) {
      arr.push(keyPosit.Alt)
    }
    if (e.shiftKey) {
      arr.push(keyPosit.Shift)
    }
    if (!arr.includes(e.keyCode)) {
      arr.push(e.keyCode)
    }
    return arr
  }

  // Check if the key value matches
  checkKey(
    e: { stopPropagation: () => void; preventDefault: () => void },
    key: string
  ) {
    const o = this.getOriginEventCodeArr(e)
    const k = this.getKeyCodeArr(key)
    if (o.length !== k.length) {
      return false
    }
    for (let i = 0; i < o.length; i += 1) {
      const index = k.findIndex((item) => item === o[i])
      if (index === -1) {
        return false
      }
      k.splice(index, 1)
    }
    return true
  }

  onKeydown(e: { stopPropagation: () => void; preventDefault: () => void }) {
    Object.keys(this.shortcutMap).forEach((key) => {
      if (this.checkKey(e, key)) {
        e.stopPropagation()
        e.preventDefault()
        this.shortcutMap[key].forEach(
          (f: { fn: { call: (arg0: any) => void }; ctx: any }) => {
            f.fn.call(f.ctx)
          }
        )
      }
    })
  }

  // Add shortcut command
  addShortcut(key: string, fn: any, ctx?: any) {
    key.split(/\s*\|\s*/).forEach((item) => {
      if (this.shortcutMap[item]) {
        this.shortcutMap[item].push({
          fn,
          ctx
        })
      } else {
        this.shortcutMap[item] = [
          {
            fn,
            ctx
          }
        ]
      }
    })
  }

  // Remove shortcut command
  removeShortcut(key: string, fn: any) {
    key.split(/\s*\|\s*/).forEach((item) => {
      if (this.shortcutMap[item]) {
        if (fn) {
          const index = this.shortcutMap[item].findIndex(
            (f: { fn: any }) => f.fn === fn
          )
          if (index !== -1) {
            this.shortcutMap[item].splice(index, 1)
          }
        } else {
          this.shortcutMap[item] = []
          delete this.shortcutMap[item]
        }
      }
    })
  }

  bindEvent() {
    this.app.event.on('keydown', this.onKeydown, this)
  }

  unBindEvent() {
    this.app.event.off('keydown', this.onKeydown)
  }
}
