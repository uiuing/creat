import { LocalData, State } from '../../types'

// Depth-first traversal based on key to determine if equal
export function isEqual(oldData: any, nowData: any) {
  if (typeof oldData !== typeof nowData) {
    return false
  }
  if (typeof oldData !== 'object') {
    return oldData === nowData
  }
  const oldKeys = Object.keys(oldData)
  const nowKeys = Object.keys(nowData)
  if (oldKeys.length !== nowKeys.length) {
    return false
  }
  for (let i = 0; i < oldKeys.length; i += 1) {
    const key = oldKeys[i]
    if (!isEqual(oldData[key], nowData[key])) {
      return false
    }
  }
  return true
}

// diff nodes
export function getDiffData(oldData: LocalData, nowData: LocalData) {
  const isUNOld = typeof oldData === 'undefined'
  const isUNNow = typeof nowData === 'undefined'
  if (isUNOld && isUNNow) {
    return undefined
  }
  if (isUNNow) {
    return {
      type: 'delete-all'
    }
  }
  if (isUNOld && nowData.nodes.length === 0) {
    return {
      type: 'delete-all'
    }
  }
  if (isUNOld) {
    return {
      type: 'cover-all',
      nodes: nowData.nodes
    }
  }
  if (isEqual(oldData.nodes, nowData.nodes)) {
    return undefined
  }
  const oldNodes = oldData.nodes
  const nowNodes = nowData.nodes
  const oldLen = oldNodes.length
  const nowLen = nowNodes.length
  // Add｜Delete Operation
  const isAdd = nowLen > oldLen
  const isDelete = nowLen < oldLen
  if (isAdd || isDelete) {
    const ANodes = isAdd ? nowNodes : oldNodes
    const PIDs = isAdd
      ? oldNodes.map((item) => item.id)
      : nowNodes.map((item) => item.id)
    let diffNodes = ANodes.filter((item) => !PIDs.includes(item.id))
    if (isDelete) {
      diffNodes = diffNodes.map((item) => ({ id: item.id })) as any
    }
    return {
      type: isAdd ? 'add' : 'delete',
      nodes: diffNodes
    }
  }
  if (nowLen === oldLen) {
    const updateNodes = []
    // Determine which attributes have changed and store those that have changed, but not those that have not
    for (let i = 0; i < nowLen; i += 1) {
      if (!isEqual(oldNodes[i], nowNodes[i])) {
        const diff = {}
        Object.keys(nowNodes[i]).forEach((key) => {
          // @ts-ignore
          if (!isEqual(oldNodes[i][key], nowNodes[i][key])) {
            // @ts-ignore
            diff[key] = nowNodes[i][key]
          }
        })
        updateNodes.push(diff)
      }
    }
    if (updateNodes.length > 0) {
      return {
        type: 'update',
        nodes: updateNodes
      }
    }
  }
  return undefined
}

// diff state att: ( backgroundColor / showGrid / showGrid )
export function getDiffState(oldData: LocalData, nowData: LocalData) {
  const oldState = oldData?.state
  if (typeof oldState === 'undefined') {
    return undefined
  }
  const nowState = nowData?.state
  const isDiffBac = oldState.backgroundColor !== nowState.backgroundColor
  const isDiffGrid = oldState.showGrid !== nowState.showGrid
  const isDiffReadonly = oldState.readonly !== nowState.readonly
  if (isDiffBac || isDiffGrid || isDiffReadonly) {
    const state: State = {}
    if (isDiffBac) {
      state.backgroundColor = nowState.backgroundColor
    }
    if (isDiffGrid) {
      state.showGrid = nowState.showGrid
    }
    if (isDiffReadonly) {
      state.readonly = nowState.readonly
    }
    return {
      type: 'update-state',
      state
    }
  }
  return undefined
}
