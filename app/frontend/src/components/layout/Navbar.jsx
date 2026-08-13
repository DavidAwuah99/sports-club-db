import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex gap-4 border-b border-gray-200 px-4 py-3">
      <Link to="/">Home</Link>
      <Link to="/athletes">Athletes</Link>
      <Link to="/teams">Teams</Link>
      <Link to="/competitions">Competitions</Link>
    </nav>
  )
}

export default Navbar
