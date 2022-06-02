import './App.css'
import { RenderRoutes } from './router'
import { joinSocket } from './api/socket'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { Modals } from './modals'

function App() {
  useEffect(() => joinSocket(), [])
  
  return (
    <Provider store={store}>
      <Modals />
      <RenderRoutes/>
    </Provider>
  )
}

export default App
