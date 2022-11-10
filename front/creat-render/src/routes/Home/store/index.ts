import { atom } from 'recoil'

import { localforageEffect } from '../../../utils/data'

export const whiteboardInfosState = atom({
  key: 'whiteboardInfosState',
  default: [],
  effects_UNSTABLE: [localforageEffect('creat-whitelist-infos')]
})
