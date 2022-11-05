import { keyPosit } from '../common/constants'
import { throttle } from '../common/utils'
import { AppObject } from '../types'

export default class Author {
  public app: AppObject

  public startScrollX: number | undefined

  public startScrollY: number | undefined

  isDragAuthor: boolean

  constructor(app: AppObject) {
    this.app = app
    // Save the scroll offset when dragging is about to start
    this.startScrollX = 0
    this.startScrollY = 0
    // Canvas drag and drop Author
    this.isDragAuthor = false
    // A little relief from lag
    this.onMove = throttle(this.onMove, this as any, 15)
    this.bindEvent()
  }

  // Save the current scroll offset
  onStart() {
    this.startScrollX = this.app.state.scrollX
    this.startScrollY = this.app.state.scrollY
  }

  // Update scroll offset and re-render
  onMove(e: any, event: { mouseOffset: { originX: number; originY: number } }) {
    if (
      typeof this.startScrollX !== 'undefined' &&
      typeof this.startScrollY !== 'undefined' &&
      typeof this.app.state.scale !== 'undefined'
    ) {
      this.app.scrollTo(
        this.startScrollX - event.mouseOffset.originX / this.app.state.scale,
        this.startScrollY - event.mouseOffset.originY / this.app.state.scale
      )
    }
  }

  bindEvent() {
    this.app.event.on('keydown', (e: { keyCode: number }) => {
      if (e.keyCode === keyPosit.Space) {
        this.isDragAuthor = true
        this.app.cursor.set('grab')
      }
    })
    this.app.event.on('keyup', () => {
      if (this.isDragAuthor) {
        this.isDragAuthor = false
        this.app.cursor.set('default')
      }
    })
  }

  // Set to edit Author
  setEditAuthor() {
    this.app.cursor.set('default')
    this.app.updateState({
      readonly: false
    })
  }

  // Set to read-only Author
  setReadonlyAuthor() {
    this.app.cursor.set('grab')
    this.app.cancelActiveNode()
    this.app.updateState({
      readonly: true
    })
  }
}
