import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Game, Login, Waiting } from '../pages'
import { path } from './constants'

export const RenderRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={path.login()} element={<Login />} />
        <Route path={path.game()} element={<Game />} />
        <Route path={path.waiting()} element={<Waiting />} />
      </Routes>
    </Router>
  )
}
