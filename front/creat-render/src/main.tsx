import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(
  document.getElementsByTagName('creat-render')[0] as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
