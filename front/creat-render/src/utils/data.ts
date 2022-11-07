import { LocalData } from 'creat-loader/src/types'
import * as localforage from 'localforage'
import { DefaultValue } from 'recoil'

export type WhiteboardInfo = {
  id: string
  name: string
  recentlyOpened: number
}

export type WhiteboardInfos = Array<WhiteboardInfo>

export type WhiteboardLocalData = LocalData

export type UserInfo = {
  id: string
  name: string
}

// ------------------------ Customised local storage methods 👇 ------------------------ Start

// ----------------------------------

export async function getWhiteboardInfos(): Promise<WhiteboardInfos> {
  let infos = (await localforage.getItem(
    'creat-whitelist-infos'
  )) as WhiteboardInfos
  if (!infos) {
    infos = []
    await setWhiteboardInfos(infos)
  }
  return infos
}

export async function setWhiteboardInfos(infos: WhiteboardInfos) {
  await localforage.setItem('creat-whitelist-infos', infos)
}

// ----------------------------------

export async function getWhiteboardLocalData(
  id?: string
): Promise<WhiteboardLocalData | undefined> {
  if (typeof id !== 'string') {
    id = window.whiteboardId
  }
  const local = (await localforage.getItem(
    `creat-whiteboard-${id}`
  )) as WhiteboardLocalData
  const data = await getWhiteboardInfos()
  const index = data.findIndex((item) => item.id === id)
  if (index !== -1) {
    data[index].recentlyOpened = Date.now()
    await setWhiteboardInfos(data)
  }
  return local || undefined
}

export async function setWhiteboardLocalData(
  localData: WhiteboardLocalData,
  id?: string
) {
  // add whiteboard info
  const infos = await getWhiteboardInfos()
  if (typeof id !== 'string') {
    id = window.whiteboardId
  }
  // If the id does not exist in the infos, initialize the storage
  if (!infos.find((info) => info.id === id)) {
    infos.push({
      id,
      name: `未命名白板-${id.slice(0, 9)}`,
      recentlyOpened: Date.now()
    })
    await setWhiteboardInfos(infos)
  }
  await localforage.setItem(`creat-whiteboard-${id}`, localData)
}

// ----------------------------------

export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const len = chars.length
  let id = Date.now().toString(36).toString()
  for (let i = 0; i < 10; i += 1) {
    id += chars[Math.floor(Math.random() * len)]
  }
  return id
}

export async function getUserInfo(): Promise<UserInfo | undefined> {
  let userInfo = (await localforage.getItem('creat-user-info')) as UserInfo
  if (!userInfo) {
    const id = generateId()
    userInfo = {
      id,
      name: `${id.slice(0, 6)}`
    }
    await setUserInfo(userInfo)
  }
  return userInfo || undefined
}

export async function setUserInfo(userInfo: UserInfo) {
  await localforage.setItem('creat-user-info', userInfo)
}

// ------------------------ Customised local storage methods 👆 ------------------------ End

// ------------------------ Manage local storage methods 👇 ------------------------ Start

export async function deleteWhiteboard(id: string) {
  await localforage.removeItem(`creat-whiteboard-${id}`)
}

export async function downloadWhiteboard(id: string) {
  const localData = await getWhiteboardLocalData(id)
  if (localData) {
    const a = document.createElement('a')
    // base64 加密
    const file = new Blob(
      [btoa(unescape(encodeURIComponent(JSON.stringify(localData))))],
      {
        type: 'text/plain'
      }
    )
    a.href = URL.createObjectURL(file)
    // 找到id在infos中的名称
    const infos = await getWhiteboardInfos()
    const info = infos.find((item) => item.id === id)
    a.download = `${info?.name}.creat`
    a.click()
  }
}

// ------------------------ Manage local storage methods 👆 ------------------------ End

// ------------------------ Status offline cache customisation Hook 👇 ------------------------ Start

const customLocalforageEffect = {
  'creat-whitelist-infos': {
    get: getWhiteboardInfos,
    set: setWhiteboardInfos
  },
  'creat-user-info': {
    get: getUserInfo,
    set: setUserInfo
  },
  'creat-whiteboard': {
    get: getWhiteboardLocalData,
    set: setWhiteboardLocalData
  }
}

export const localforageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const loadPersisted = async () => {
      let savedValue: any = ''
      if (Object.keys(customLocalforageEffect).includes(key)) {
        // @ts-ignore
        savedValue = await customLocalforageEffect[key].get()
      } else {
        savedValue = await localforage.getItem(key)
      }
      if (savedValue != null) {
        setSelf(savedValue)
      }
    }

    loadPersisted()

    onSet((newValue: any) => {
      if (newValue instanceof DefaultValue) {
        localforage.removeItem(key)
      } else if (Object.keys(customLocalforageEffect).includes(key)) {
        // @ts-ignore
        customLocalforageEffect[key].set(newValue)
      } else {
        localforage.setItem(key, newValue)
      }
    })
  }

// ------------------------ Status offline cache customisation Hook 👆 ------------------------ End
