import './App.css'
import { RenderRoutes } from './router'
import { exceptionHandler, joinSocket } from './api/socket'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { Modals } from './modals'
import { SnackbarProvider } from 'notistack'
import { Notifications } from './components/Notifications'
import { handleError, showNotification } from './store/notification/notificationSlise';
import { useAppDispatch } from './hooks/redux'
import { ListTest } from './test'

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <ListenerSocket />
        <Notifications />
        <Modals />
        <RenderRoutes />
      </SnackbarProvider>
    </Provider>
  )
}

export default App


const ListenerSocket = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    joinSocket(dispatch)
  }, [])
  return null;
}
