import { atom } from 'recoil'

import { localforageEffect } from '../../../utils/data'

export const userInfoState = atom({
  key: 'userInfoState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-info')]
})

export const userTmpColorState = atom({
  key: 'userTmpColorState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-tmp-color')]
})

export const localDataState = atom({
  key: 'localDataState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-whiteboard')]
})
