import EventEmitter from 'eventemitter3'

import { AppObject } from '../types'

export default class ImageEdit extends EventEmitter {
  public app: AppObject

  public el: HTMLInputElement | null

  isReady: boolean

  public previewEl: HTMLDivElement | null

  public imageData: {
    url: string
    width: number
    height: number
    ratio: number
    imageObj: HTMLInputElement
  } | null

  public maxWidth: number

  public maxHeight: number

  public maxRatio: number

  constructor(app: AppObject) {
    super()

    this.app = app

    this.el = null

    this.isReady = false

    this.previewEl = null

    this.imageData = null

    this.maxWidth = 750

    this.maxHeight = 450

    this.maxRatio = this.maxWidth / this.maxHeight

    this.onImageSelectChange = this.onImageSelectChange.bind(this)
  }

  updatePreviewElPos(x: number, y: number) {
    const width = 100
    if (!this.imageData) {
      // eslint-disable-next-line no-console
      console.error('imageData is null')
      return
    }
    const height = width / this.imageData.ratio
    if (!this.previewEl) {
      this.previewEl = document.createElement('div')
      this.previewEl.style.position = 'fixed'
      this.previewEl.style.width = `${width}px`
      this.previewEl.style.height = `${height}px`
      this.previewEl.style.backgroundImage = `url('${this.imageData.url}')`
      this.previewEl.style.backgroundSize = 'cover'
      this.previewEl.style.pointerEvents = 'none'
      document.body.appendChild(this.previewEl)
    }
    const tp = this.app.calculate.mountELToWindow(x, y)
    this.previewEl.style.left = `${tp.x - width / 2}px`
    this.previewEl.style.top = `${tp.y - height / 2}px`
  }

  reset() {
    if (this.el) {
      this.el.value = ''
    }
    this.isReady = false
    if (this.previewEl) {
      document.body.removeChild(this.previewEl)
    }
    this.previewEl = null
    this.imageData = null
  }

  async getImageUrl(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = () => {
        reject()
      }
      reader.readAsDataURL(file)
    })
  }

  async getImageSize(url: string): Promise<{
    imageObj: HTMLInputElement
    size: {
      width: number
      height: number
    }
    ratio: number
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        let { width } = img
        let { height } = img
        const ratio = img.width / img.height
        if (img.width > this.maxWidth || img.height > this.maxHeight) {
          if (ratio > this.maxRatio) {
            width = this.maxWidth
            height = this.maxWidth / ratio
          } else {
            height = this.maxHeight
            width = this.maxHeight * ratio
          }
        }
        resolve({
          imageObj: img,
          size: {
            width,
            height
          },
          ratio
        } as any)
      }
      img.onerror = () => {
        reject()
      }
      img.src = url
    })
  }

  async onImageSelectChange(e: any) {
    const url = await this.getImageUrl(e.target.files[0])
    if (typeof url !== 'string') {
      // eslint-disable-next-line no-console
      console.error('url is not string')
      return
    }
    const { imageObj, size, ratio } = await this.getImageSize(url)
    this.isReady = true
    this.imageData = {
      url,
      ...size,
      ratio,
      imageObj
    }
    this.emit('imageSelectChange', this.imageData)
  }

  selectImage() {
    if (!this.el) {
      this.el = document.createElement('input')
      this.el.style.position = 'fixed'
      this.el.style.left = '-9999999px'
      this.el.type = 'file'
      this.el.accept = 'image/*'
      this.el.addEventListener('change', this.onImageSelectChange)
      document.body.appendChild(this.el)
    }
    this.el.click()
  }
}
