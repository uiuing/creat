import { LocalData, State } from '../../types'

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
      type: 'add-all',
      node: nowData.nodes
    }
  }
  if (JSON.stringify(oldData.nodes) === JSON.stringify(nowData.nodes)) {
    return undefined
  }
  const oldNodes = oldData.nodes
  const nowNodes = nowData.nodes
  const oldLen = oldNodes.length
  const nowLen = nowNodes.length
  const isAdd = nowLen > oldLen
  const isDelete = nowLen < oldLen
  if (isAdd || isDelete) {
    const ANodes = isAdd ? nowNodes : oldNodes
    const PIDs = isAdd
      ? oldNodes.map((item) => item.id)
      : nowNodes.map((item) => item.id)
    const diffNodes = ANodes.filter((item) => !PIDs.includes(item.id))
    return {
      type: isAdd ? 'add' : 'delete',
      nodes: diffNodes
    }
  }
  if (nowLen === oldLen) {
    const updateNodes = []
    for (let i = 0; i < nowLen; i += 1) {
      if (JSON.stringify(oldNodes[i]) !== JSON.stringify(nowNodes[i])) {
        updateNodes.push(nowNodes[i])
      }
    }
    if (updateNodes.length > 0) {
      return {
        type: 'update',
        node: updateNodes
      }
    }
  }
  return undefined
}

// diff state
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
    const r: State = {}
    if (isDiffBac) {
      r.backgroundColor = nowState.backgroundColor
    }
    if (isDiffGrid) {
      r.showGrid = nowState.showGrid
    }
    if (isDiffReadonly) {
      r.readonly = nowState.readonly
    }
    return r
  }
  return undefined
}
