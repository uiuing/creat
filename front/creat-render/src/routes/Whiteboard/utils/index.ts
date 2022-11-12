import { AppResponse } from '@uiuing/creat-loader/types'
import { useRecoilValue } from 'recoil'

import {
  cloudLocalDataState,
  cloudWhiteboardState,
  localDataState
} from '../store'

export function whiteboardApp(): AppResponse {
  return window.whiteboard
}

export const GetLocalDataStateObject = () =>
  useRecoilValue(cloudWhiteboardState).isAuthor
    ? localDataState
    : cloudLocalDataState

export const removePromise = (p: Object) => JSON.parse(JSON.stringify(p))
