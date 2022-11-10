import { useSetRecoilState } from 'recoil'

import { useInitWhiteboardLoader } from '../../../Hooks/init'
import useWatch from '../../../Hooks/useWatch'
import { localDataState } from '../../../store'
import { MenuControl } from '../../MenuControl'
import RenderBuffer from '../Buffer'

export default function RenderContent() {
  const isLoaderOK = useInitWhiteboardLoader()
  const setLocalData = useSetRecoilState(localDataState)
  if (isLoaderOK) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWatch(setLocalData as any)
    return <MenuControl />
  }
  return <RenderBuffer />
}
