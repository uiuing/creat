import { NodeArray } from '@uiuing/creat-loader/types'
import diff from 'microdiff'

export function parseDiffNodes(oldNodes: NodeArray, newNodes: NodeArray) {
  if (oldNodes.length > newNodes.length) {
    const oldIDS = oldNodes.map((item) => item.id)
    const newIDS = newNodes.map((item) => item.id)
    const diffIDS = oldIDS.filter((item) => !newIDS.includes(item))
    return {
      type: 'delete',
      nodes: diffIDS.map((id) => ({ id }))
    }
  }
  if (oldNodes.length < newNodes.length) {
    const oldIDS = oldNodes.map((item) => item.id)
    const newIDS = newNodes.map((item) => item.id)
    const diffIDS = newIDS.filter((item) => !oldIDS.includes(item))
    const diffNodes = newNodes.filter((item) => diffIDS.includes(item.id))
    return {
      type: 'add',
      nodes: diffNodes
    }
  }
  if (oldNodes.length === newNodes.length) {
    const oldIDS = oldNodes.map((item) => item.id)
    const newIDS = newNodes.map((item) => item.id)
    const updateNodes = []
    for (let i = 0; i < oldIDS.length; i += 1) {
      // 找到id相同的节点
      const oldNode = oldNodes.find((item) => item.id === oldIDS[i])
      const newNode = newNodes.find((item) => item.id === newIDS[i])
      const keys = Object.keys(oldNode as any)
      const diffObj = {}
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[j]
        if (key !== 'id') {
          const oldValue = (oldNode as any)[key]
          const newValue = (newNode as any)[key]
          // 判断是不是数组
          if (
            Array.isArray(oldValue) &&
            Array.isArray(newValue) &&
            checkHasDiff(oldValue, newValue)
          ) {
            ;(diffObj as any)[key] = newValue
          }
          if (
            typeof oldValue === 'object' &&
            typeof newValue === 'object' &&
            checkHasDiff(oldValue, newValue)
          ) {
            ;(diffObj as any)[key] = newValue
          }
          if (
            typeof oldValue === 'string' &&
            typeof newValue === 'string' &&
            oldValue !== newValue
          ) {
            ;(diffObj as any)[key] = newValue
          }
          if (
            typeof oldValue === 'number' &&
            typeof newValue === 'number' &&
            oldValue !== newValue
          ) {
            ;(diffObj as any)[key] = newValue
          }
        }
      }
      if (Object.keys(diffObj).length > 0) {
        // @ts-ignore
        diffObj.id = newNode.id
        updateNodes.push(diffObj)
      }
    }
    return {
      type: 'update',
      nodes: updateNodes
    }
  }
  return undefined
}

export function checkHasDiff(
  oldData: any[] | Record<string, any>,
  newData: any[] | Record<string, any>
) {
  const diffRes = diff(oldData, newData)
  return diffRes && diffRes.length > 0
}

export function parseDiffState(oldState: any, newState: any) {
  const keys = Object.keys(oldState)
  const diffObj = {}
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    const oldValue = oldState[key]
    const newValue = newState[key]
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      if (checkHasDiff(oldValue, newValue)) {
        ;(diffObj as any)[key] = newValue
      }
    }
    if (typeof oldValue === 'string' && typeof newValue === 'string') {
      if (oldValue !== newValue) {
        ;(diffObj as any)[key] = newValue
      }
    }
    if (typeof oldValue === 'number' && typeof newValue === 'number') {
      if (oldValue !== newValue) {
        ;(diffObj as any)[key] = newValue
      }
    }
  }
  return Object.keys(diffObj).length > 0 ? diffObj : undefined
}
