import { atom } from 'recoil'

import { localforageEffect } from '../../../utils/data'

export const userInfoState = atom({
  key: 'userInfoState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-info')]
})

export const userTmpInfoState = atom({
  key: 'userTmpInfoState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-tmp-color')]
})

export const localDataState = atom({
  key: 'localDataState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-whiteboard')]
})

export const cloudLocalDataState = atom({
  key: 'cloudDataState',
  default: {}
})

export const cloudWhiteboardState = atom({
  key: 'cloudWhiteboardState',
  default: {
    isCloud: false,
    isAuthor: false,
    name: undefined,
    readonly: false
  }
})
