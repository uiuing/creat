import { LocalData } from '@uiuing/creat-loader/types'
import { atom } from 'recoil'

import { localforageEffect, UserInfo } from '../../../utils/data'

export const userInfoState = atom<UserInfo | {}>({
  key: 'userInfoState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-info')]
})

export const userTmpInfoState = atom<any>({
  key: 'userTmpInfoState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-user-tmp-color')]
})

export const localDataState = atom<LocalData | {}>({
  key: 'localDataState',
  default: {},
  effects_UNSTABLE: [localforageEffect('creat-whiteboard')]
})

export const cloudLocalDataState = atom<LocalData | {}>({
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

export const creatLoaderOKState = atom({
  key: 'creatLoaderOKState',
  default: false
})
