import Home from "./components/pages/Home";
import './index.css'

function App() {
  return (
    <div style={{ background: '#f5f1e8', minHeight: '100vh' }}>
      <nav style={{ 
        background: 'rgba(253,251,245,0.95)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(107,93,79,0.2)'
      }}>
        <div style={{ fontFamily: "'Handlee', cursive", fontSize: '1.4rem' }}>lucy shah ♡</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#work" style={{ color: '#6b5d4f', textDecoration: 'none' }}>work</a>
          <a href="#about" style={{ color: '#6b5d4f', textDecoration: 'none' }}>about</a>
          <a href="#contact" style={{ color: '#6b5d4f', textDecoration: 'none' }}>contact</a>
        </div>
      </nav>
      
      <Home />
    </div>
  )
}

export default App