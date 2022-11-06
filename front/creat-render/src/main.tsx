import './global.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import routes from './routes'

ReactDOM.createRoot(
  document.getElementsByTagName('creat-render')[0] as HTMLElement
).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
)
