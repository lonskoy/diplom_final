import './App.css'
import { Header } from './components/header'
import { Main } from './components/main';
import { Sidebar } from './components/sidebar'
import { BrowserRouter as Router } from 'react-router-dom'; // Добавляем Router

function App() {

  return (
    <Router>
      <div className='appContainer'>
        <Header />
        <div className='bodyContainer'>
          <Sidebar />
          <Main />
        </div>

      </div>
    </Router>
  )
}

export default App
