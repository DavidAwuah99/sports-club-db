import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
      {user && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">{user.username}</span>
            <Badge tone="blue">{user.role}</Badge>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Log out
          </button>
        </>
      )}
    </header>
  )
}

export default Topbar
