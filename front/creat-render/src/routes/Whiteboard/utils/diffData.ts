import {
  DiffNodesRes,
  DiffStateRes,
  LocalData,
  NodeArray,
  State
} from '@uiuing/creat-loader/types'

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
export function getDiffData(
  oldData: LocalData | undefined,
  nowData: LocalData
) {
  const isUNOld = typeof oldData === 'undefined'
  const isUNNow = typeof nowData === 'undefined'

  if (isUNOld && isUNNow) {
    return undefined
  }
  if (isUNOld) {
    return {
      type: 'cover-all',
      nodes: nowData.nodes
    }
  }

  if (isUNNow || (isUNOld && nowData.nodes.length === 0)) {
    return {
      type: 'delete-all'
    }
  }

  if (isEqual(oldData.nodes, nowData.nodes)) {
    return undefined
  }
  const oldNodes = oldData.nodes || []
  const nowNodes = nowData.nodes || []
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
    // 根据节点的id来遍历
    for (let i = 0; i < nowLen; i += 1) {
      const nowNode = nowNodes[i]
      const oldNode = oldNodes.find((item) => item.id === nowNode.id)
      if (oldNode) {
        const updateNode = {}
        const nowKeys = Object.keys(nowNode)
        const oldKeys = Object.keys(oldNode)
        for (let j = 0; j < nowKeys.length; j += 1) {
          const key = nowKeys[j]
          if (oldKeys.includes(key)) {
            // @ts-ignore
            if (!isEqual(oldNode[key], nowNode[key])) {
              // @ts-ignore
              updateNode[key] = nowNode[key]
            }
          } else {
            // @ts-ignore
            updateNode[key] = nowNode[key]
          }
        }
        if (Object.keys(updateNode).length > 0) {
          updateNodes.push({
            id: nowNode.id,
            ...updateNode
          })
        }
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

export function parseDiffNodes(
  oldNodes: NodeArray,
  { type, nodes }: DiffNodesRes
): NodeArray {
  const fns = {
    add: () => {
      oldNodes.push(...nodes)
    },
    delete: () => {
      nodes.forEach((item) => {
        const index = oldNodes.findIndex((node) => node.id === item.id)
        oldNodes.splice(index, 1)
      })
    },
    update: () => {
      nodes.forEach((item) => {
        const index = oldNodes.findIndex((node) => node.id === item.id)
        oldNodes[index] = { ...oldNodes[index], ...item }
      })
    },
    'cover-all': () => {
      oldNodes.splice(0, oldNodes.length, ...nodes)
    },
    'delete-all': () => {
      oldNodes.splice(0, oldNodes.length)
    }
  }
  fns[type]()
  return oldNodes
}

// diff state att: ( backgroundColor / showGrid / showGrid )
export function getDiffState(
  oldData: LocalData | undefined,
  nowData: LocalData
) {
  const oldState = oldData?.state
  if (typeof oldState === 'undefined') {
    return undefined
  }
  const nowState = nowData?.state
  const isDiffBac = oldState.backgroundColor !== nowState.backgroundColor
  const isDiffGrid = oldState.showGrid !== nowState.showGrid
  const isDiffReadonly = oldState.readonly !== nowState.readonly
  const isDiffScrollY = oldState.scrollY !== nowState.scrollY
  const isDiffScrollX = oldState.scrollX !== nowState.scrollX
  const isDiffScale = oldState.scale !== nowState.scale

  if (isDiffBac || isDiffGrid || isDiffReadonly) {
    const state: any = {}
    if (isDiffBac) {
      state.backgroundColor = nowState.backgroundColor
    }
    if (isDiffGrid) {
      state.showGrid = nowState.showGrid
    }
    if (isDiffReadonly) {
      state.readonly = nowState.readonly
    }
    if (isDiffScrollY) {
      state.scrollY = nowState.scrollY
    }
    if (isDiffScrollX) {
      state.scrollX = nowState.scrollX
    }
    if (isDiffScale) {
      state.scale = nowState.scale
    }
    return {
      type: 'update-state',
      state
    }
  }
  return undefined
}

export function parseDiffState(oldState: State, { state }: DiffStateRes) {
  Object.keys(state).forEach((key) => {
    // @ts-ignore
    oldState[key] = state[key]
  })
  return oldState
}
