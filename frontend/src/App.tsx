import './App.css';
import { RenderRoutes } from './router';
import { Provider } from 'react-redux';
import { store } from './store';
import { Modals } from './modals';
import { SnackbarProvider } from 'notistack';
import { Notifications } from './components/Notifications';

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <Notifications />
        <Modals />
        <RenderRoutes />
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
