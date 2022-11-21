import CreatLoader from './API'
import { AppResponse, AppState } from './types'

function checkElType(el: any) {
  if (!el || !(el instanceof HTMLElement)) {
    throw new Error('mountEl is not a HTMLElement !')
  }
  if (
    !['absolute', 'fixed', 'relative'].includes(
      window.getComputedStyle(<HTMLElement>el).position
    )
  ) {
    throw new Error(
      'The DOM being mounted needs to be set to absolute/fixed/relative positioning!'
    )
  }
}

function parseElObject(el: any) {
  if (typeof el === 'string') {
    if (el.startsWith('#')) {
      return document.getElementById(el.slice(1))
    }
    if (el.startsWith('.')) {
      return document.getElementsByClassName(el.slice(1))[0]
    }
    return document.querySelector(el)
  }
  return el
}

export default function creatLoader(state: AppState) {
  function mount(mountEl: string | Object | HTMLElement): AppResponse {
    // Get DOM object
    const el = parseElObject(mountEl)

    // Check if it is a mountable DOM object
    checkElType(el)

    // Initialising the rendering object
    return new CreatLoader({
      mountEL: el as any,
      plotType: state.plotType,
      state
      // Type of redirection
    }) as unknown as AppResponse
  }
  return { mount }
}
