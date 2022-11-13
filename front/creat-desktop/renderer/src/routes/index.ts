import { createBrowserRouter } from 'react-router-dom'

import HomePage from './Home'
import Whiteboard from './Whiteboard'

const routes = createBrowserRouter([
  {
    path: '/',
    element: HomePage()
  },
  {
    path: '/:whiteboard_id',
    element: Whiteboard()
  }
])

export default routes
