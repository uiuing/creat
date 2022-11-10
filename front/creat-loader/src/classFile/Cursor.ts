import { DRAG_NODE_PARTS } from '../common/constants'
import { AppObject } from '../types'

export default class Cursor {
  public app: AppObject

  public currentType: string

  constructor(app: AppObject) {
    this.app = app
    this.currentType = 'default'
  }

  // Set the mouse pointer style
  set(type = 'default') {
    this.currentType = type
    let style = type
    if (type === 'eraser') {
      style = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAbZJREFUSEvNlL1rVEEUxc95uwvCVjYKNnZa2ATEXrALNhaKiBgQDabQwt13hlQbi30w8x4oNhaCkYBFElAhoJXaip2FRfIX2FhY2c2VJy5skn0fERacbphzf3Pv5dxLzOlwTlz8H2Dv/VqSJF/NbFHS3bpqW2ec5/mqmWUk1wC8iTFmzrnLVfBWYO/9gGQxBVkl+c7M1iWdnwVvBIcQ7gN4OiP4IckPZrYj6fTB91pwURT3YozPqso1sxWSnwF8knR8WlcJDiHcAfC8yY5mdgvAT5KvJXUn+plg7/0SyZdN0Kn3bQA/JK1UgvM8v2Fmr44A/SMleSlN048zwSGEqwC2jgpNkmRxOBy+r+yx9/4xyQUAF9vCzeyKc+5trStCCCaJRVFciDF+aQG/Lmmz1schhHKKXkg6UQqzLDvT7XZ3a+BLkjZaTV6ZcafTOTsYDPbKgPF4fLLX630/VCa5nKZprRX32a1cMiRHZTsmsNFodKzf7/+a3M3stnNuvalNh3w8gQO4Jmn7r1OeADhlZjedc62sWDUgyyQfADgH4BuAR2WG5UdNmdZOXtvgOl3jdvvXT+YG/g3VNZQXhpoDKQAAAABJRU5ErkJggg==) 10 10, auto`
    }
    if (type === 'text') {
      style = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAWZJREFUSEvNlLFOwzAQhi+5iaUrDDwBHekDNHtZEOorMFk5JQ8APEAsJyOPwAjsZEZ0LAMrCzwBUxx0kVM5adI4RZXwlMj2p///fXceHGh5B+LC/wPHcXxWFMWSHSulbtvO91JsoA8AMDXAXCkV2PC9wAwgIlZ5Y8HubOWjwLX9GtCCN1Q7g1v2N+oM/Mr3/Usp5UftwAlsoG8AcNRlnfeTJHkflbGBrnvqvZGrM5iI5gDw0gNdI+KyrXQwigHoDyLO+qAM78w4DMNjz/O++todEae7oJ1gIcQpIn7+BboFHrDP5wOlVO4yuBpREBGX1HnPRWdoQ3EURQut9VMXtCzLkzRNv12UblUFET0CwEX7stZ6lmXZagx0o1gIMTEPNrEAK631dQ01rVuNyPobAHg+5PZeQ7HVXWz31ff9eynls62SiEoDCqzhU+Vu73VFMd/14qZiWDGDuCOrZf/b952G0Nh8+fwvoNqzF6HDmhsAAAAASUVORK5CYII=) 10 10, auto`
    }
    this.app.mountEL.style.cursor = style
  }

  setEraser() {
    this.set('eraser')
  }

  setText() {
    this.set('text')
  }

  setMove() {
    this.set('move')
  }

  hide() {
    this.set('none')
  }

  reset() {
    this.set()
  }

  setCrossHair() {
    this.set('crosshair')
  }

  // Set to a movable state in a certain direction
  setResize(direction: string) {
    let type = ''
    switch (direction) {
      case DRAG_NODE_PARTS.BODY:
        type = 'move'
        break
      case DRAG_NODE_PARTS.ROTATE:
        type = 'grab'
        break
      case DRAG_NODE_PARTS.TOP_LEFT_BUTTON:
        type = 'nw-resize'
        break
      case DRAG_NODE_PARTS.TOP_RIGHT_BUTTON:
        type = 'ne-resize'
        break
      case DRAG_NODE_PARTS.BOTTOM_RIGHT_BUTTON:
        type = 'se-resize'
        break
      case DRAG_NODE_PARTS.BOTTOM_LEFT_BUTTON:
        type = 'sw-resize'
        break
      default:
        break
    }
    this.set(type)
  }
}
