import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Game, Login } from '../pages'
import { path } from './constants'

export const renderRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={path.login()} element={<Login />} />
        <Route path={path.game()} element={<Game />} />
      </Routes>
    </Router>
  )
}
