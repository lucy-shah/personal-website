import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { to: '/resume', label: 'resume' },
  { to: '/projects', label: 'projects' },
  { to: '/inspiration', label: 'inspiration' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact', className: 'nav-contact' },
]

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Lucy Shah, home">lucy shah</Link>
      <nav aria-label="Main navigation">
        {navigation.map(({ to, label, className }) => (
          <NavLink className={className} key={to} to={to}>{label}</NavLink>
        ))}
      </nav>
    </header>
  )
}

export default SiteHeader
