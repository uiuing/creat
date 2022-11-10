import { useWhiteboardId } from '../../Hooks/parse'
import RenderBuffer from '../Render/Buffer'
import RenderContent from '../Render/Content'
import RenderNone from '../Render/None'

export default function LayoutPage() {
  const [hasId, checkOK] = useWhiteboardId()
  if (checkOK) {
    return hasId ? (
      <>
        <RenderContent />
      </>
    ) : (
      <RenderNone />
    )
  }
  return <RenderBuffer />
}
