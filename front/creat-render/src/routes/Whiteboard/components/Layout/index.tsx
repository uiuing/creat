import { initSyncCloud } from '../../../../api/ws/sync'
import { useWhiteboardId } from '../../Hooks/parse'
import { useWatchReceiveState } from '../../Hooks/useWatchReceiveState'
import RenderBuffer from '../Render/Buffer'
import RenderContent from '../Render/Content'
import RenderNone from '../Render/None'

export default function LayoutPage() {
  initSyncCloud()

  useWatchReceiveState()

  const [hasId, needJoin, checkOK] = useWhiteboardId()

  if (checkOK) {
    return hasId || needJoin ? (
      <>
        <RenderContent />
      </>
    ) : (
      <RenderNone />
    )
  }
  return <RenderBuffer />
}
