import './App.css'
import { renderRoutes } from './router'
import { joinSocket } from './api/socket'
import { useEffect } from 'react'

function App() {
  useEffect(() => joinSocket(), [])

  return (
    <div className="App">
      {renderRoutes()}
    </div>
  )
}

export default App
