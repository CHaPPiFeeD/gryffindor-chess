import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import { path } from './constants'

export const renderRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={path.login()} element={<Login />} />
      </Routes>
    </Router>
  )
}
