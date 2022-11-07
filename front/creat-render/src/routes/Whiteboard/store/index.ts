import { atom } from 'recoil'

import { localforageEffect } from '../../../utils/data'

export const userInfoState = atom({
  key: 'whiteboardInfosState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-info')]
})

export const localDataState = atom({
  key: 'localDataState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-whiteboard')]
})
