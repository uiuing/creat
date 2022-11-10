import { useSetRecoilState } from 'recoil'

import { useInitWhiteboardLoader } from '../../../Hooks/init'
import useWatch from '../../../Hooks/useWatch'
import { GetLocalDataStateObject } from '../../../utils'
import { MenuControl } from '../../MenuControl'
import RenderBuffer from '../Buffer'

export default function RenderContent() {
  const isLoaderOK = useInitWhiteboardLoader()
  const setLocalData = useSetRecoilState(GetLocalDataStateObject())

  // TODO 缺少设置颜色和名称的界面

  if (isLoaderOK) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWatch(setLocalData as any)
    return <MenuControl />
  }
  return <RenderBuffer />
}
