import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-name" to="/">lucy shah</Link>
      <nav className="footer-socials" aria-label="Social links">
        <a href="https://github.com/lucy-shah" target="_blank" rel="noreferrer">github</a>
        <span aria-hidden="true">|</span>
        <a href="mailto:shah.lu@northeastern.edu">email</a>
        <span aria-hidden="true">|</span>
        <a href="https://www.linkedin.com/in/lucy-shah" target="_blank" rel="noreferrer">linkedin</a>
      </nav>
      <Link to="/">back to the beginning ↑</Link>
    </footer>
  )
}

export default SiteFooter
