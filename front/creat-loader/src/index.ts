import CreatLoader from './API'
import { AppResponse, AppState } from './types'

export default function creatLoader(state: AppState) {
  function mount(mountEl: string | Object | HTMLElement): AppResponse {
    // get DOM
    const el =
      typeof mountEl === 'string' ? document.querySelector(mountEl) : mountEl
    // check
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
    // init
    return new CreatLoader({
      mountEL: el as any,
      plotType: state.plotType,
      state
    }) as unknown as AppResponse
  }
  return { mount }
}
