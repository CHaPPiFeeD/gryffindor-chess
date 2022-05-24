import './App.css'
import { renderRoutes } from './router'

function App() {
  return (
    <div className="App">
      {renderRoutes()}
    </div>
  )
}

export default App
