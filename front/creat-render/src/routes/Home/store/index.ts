import { atom } from 'recoil'

import { localforageEffect } from '../../../utils/data'

export const whiteboardInfosState = atom({
  key: 'whiteboardInfosState',
  default: [],
  effects_UNSTABLE: [localforageEffect('creat-whitelist-infos')]
})

export const whiteboardGlobalState = atom({
  key: 'whiteboardState',
  default: {
    currentType: 'selection',
    canUndo: false,
    canRedo: false
  }
})

export const whiteboardLocalDataState = atom({
  key: 'whiteboardLocalDataState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-whiteboard')]
})
