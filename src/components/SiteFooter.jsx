import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-name" to="/">lucy shah</Link>
      <Link to="/inspiration">things that inspire me</Link>
      <Link to="/">back to the beginning ↑</Link>
    </footer>
  )
}

export default SiteFooter
