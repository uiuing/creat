import { deepCopy } from '../common/utils'
import { AppObject, LocalData } from '../types'

export default class History {
  public app: AppObject

  public historyStack: Array<LocalData>

  public length: number

  public index: number

  public fixIndex: number

  constructor(app: AppObject) {
    this.app = app

    this.historyStack = []

    this.length = 0

    this.index = -1

    this.fixIndex = -1
  }

  emitChange() {
    this.app.emit('shuttle', this.index, this.length)
  }

  now() {
    return this.historyStack[this.length - 1]
  }

  clear() {
    this.index = -1
    this.length = 0
    this.historyStack = []
    this.emitChange()
  }

  add(data: LocalData) {
    const prev = this.length > 0 ? this.historyStack[this.length - 1] : null
    const copyData = deepCopy(data)
    if (copyData === prev) {
      return
    }
    this.historyStack.push(copyData)
    this.length += 1
    this.index = this.length - 1
    this.emitChange()
  }

  shuttle() {
    const oldData = this.app.getData()
    const data = this.historyStack[this.index]
    // Avoid interference and enforce correction
    this.fixIndex = this.index
    this.app
      .setData(data, true)
      .then(() => {
        this.index = this.fixIndex
        this.emitChange()
        this.app.emit('change', data)
        this.app.emitDiffNodesChange(oldData, data)
        this.app.emitDiffStateChange(oldData, data)
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.error('History shuttle setData error')
      })
  }

  undo() {
    if (this.index <= 0) {
      return
    }
    this.index -= 1
    this.shuttle()
  }

  redo() {
    if (this.index >= this.length - 1) {
      return
    }
    this.index += 1
    this.shuttle()
  }
}
