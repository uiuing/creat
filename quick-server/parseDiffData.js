function parseDiffNodes(oldNodes, { type, nodes }) {
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
        // eslint-disable-next-line no-param-reassign
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

export default function parseDiffData(oldData, config) {
  const newData = {}
  newData.nodes = parseDiffNodes(oldData.nodes, config)
  return newData.nodes
}
