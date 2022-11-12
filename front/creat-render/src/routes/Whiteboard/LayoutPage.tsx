import RenderBuffer from './components/Render/Buffer'
import RenderContent from './components/Render/Content'
import RenderNone from './components/Render/None'
import useInitWhiteboard from './Hooks/useInitWhiteboard'

export default function LayoutPage() {
  const [checkOK, hasWhiteboardId] = useInitWhiteboard()

  if (checkOK) {
    return hasWhiteboardId ? (
      <>
        <RenderContent />
      </>
    ) : (
      <RenderNone />
    )
  }
  return <RenderBuffer />
}
