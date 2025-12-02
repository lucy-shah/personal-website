import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/homepage'
import MainPage from './components/MainPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
