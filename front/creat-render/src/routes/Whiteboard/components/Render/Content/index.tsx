import { useInitWhiteboardLoader } from '../../../Hooks/useInitWhiteboardLoader'
import { MenuControl } from '../../MenuControl'
import RenderBuffer from '../Buffer'

export default function RenderContent() {
  const isLoaderOK = useInitWhiteboardLoader()

  // useWatch(setLocalData as any, isLoaderOK)

  if (isLoaderOK) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return <MenuControl />
  }
  return <RenderBuffer />
}
