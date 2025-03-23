import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import History from '../pages/History'
import Settings from '../pages/Settings'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/history',
                element: <History />
            },
            {
                path: '/settings',
                element: <Settings />
            }
        ]
    }
])

export default router