import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth, FindGame, Game, NotFound, Waiting } from '../pages';
import { path } from './constants';

export const RenderRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={path.auth()} element={<Auth />} />
        <Route path={path.findGame()} element={<FindGame />} />
        <Route path={path.game()} element={<Game />} />
        <Route path={path.waiting()} element={<Waiting />} />
        <Route path={path.notFound()} element={<NotFound />} />
      </Routes>
    </Router>
  );
};
