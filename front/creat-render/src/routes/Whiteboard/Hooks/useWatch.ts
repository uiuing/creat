import { useSetRecoilState } from 'recoil'

import { whiteboardApp } from '../utils'

export default function useWatch(
  setLocalData: ReturnType<typeof useSetRecoilState>
) {
  whiteboardApp()?.watch.localDataChange((data) => {
    setLocalData(data)
  })
}
