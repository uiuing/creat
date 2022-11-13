import { useInitWhiteboardLoader } from '../../../Hooks/useInitWhiteboardLoader'
import { MenuControl } from '../../MenuControl'
import RenderBuffer from '../Buffer'

export default function RenderContent() {
  const isLoaderOK = useInitWhiteboardLoader()
  // TODO 不是作者但是进来了，那么缺少设置颜色和名称的界面

  // useWatch(setLocalData as any, isLoaderOK)

  if (isLoaderOK) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return <MenuControl />
  }
  return <RenderBuffer />
}
