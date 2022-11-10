import { atom } from 'recoil'

export const closeShareState = atom<any>({
  key: 'closeShareState',
  default: undefined
})

export const joinShareState = atom<any>({
  key: 'joinShareState',
  default: undefined
})

export const quitShareState = atom<any>({
  key: 'quitShareState',
  default: undefined
})

export const changeShareState = atom<any>({
  key: 'changeShareState',
  default: undefined
})

export const syncMouseState = atom<any>({
  key: 'syncMouseState',
  default: undefined
})

export const socketIsOKState = atom<boolean>({
  key: 'socketIsOKState',
  default: false
})

export const cooperationUsersState = atom<
  | undefined
  | Array<{
      name: string
      color: string
      rights: 'contributor' | 'author'
    }>
>({
  key: 'cooperationUsersState',
  default: undefined
})
