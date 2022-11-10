import './global.scss'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import routes from './routes'

function Render() {
  return (
    <RecoilRoot>
      <RouterProvider router={routes} />
    </RecoilRoot>
  )
}

ReactDOM.createRoot(
  document.getElementsByTagName('creat-render')[0] as HTMLElement
).render(<Render />)
