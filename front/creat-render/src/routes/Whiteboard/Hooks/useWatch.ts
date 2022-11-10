import { DiffNodesRes } from '@uiuing/creat-loader/types'
import { useSetRecoilState } from 'recoil'

import { whiteboardApp } from '../utils'
import { syncNodes, syncState } from '../utils/sendMessage'

export default function useWatch(
  setLocalData: ReturnType<typeof useSetRecoilState>
) {
  whiteboardApp()?.watch.localDataChange((data) => {
    setLocalData(data)
  })
  whiteboardApp()?.watch.diffNodesChange((data) => {
    if (window.isCloud) {
      syncNodes(data as DiffNodesRes)
    }
  })
  whiteboardApp()?.watch.diffStateChange((state) => {
    if (window.isCloud) {
      // TODO: 节流, 在只读的情况下数据同步暂时有问题 ！！
      // syncState(state)
    }
  })
}
