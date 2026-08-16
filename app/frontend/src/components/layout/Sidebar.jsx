import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_GROUPS = [
  { label: null, items: [{ to: '/', label: 'Dashboard', roles: null, end: true }] },
  {
    label: 'People',
    items: [
      { to: '/athletes', label: 'Athletes', roles: null },
      { to: '/coaches', label: 'Coaches', roles: ['Admin', 'Coach'] },
    ],
  },
  {
    label: 'Memberships',
    items: [
      { to: '/membership-types', label: 'Membership Types', roles: ['Admin', 'FrontDesk'] },
      { to: '/memberships', label: 'Memberships', roles: ['Admin', 'FrontDesk'] },
      { to: '/payments', label: 'Payments', roles: ['Admin', 'FrontDesk'] },
    ],
  },
  {
    label: 'Teams & Sports',
    items: [
      { to: '/sports', label: 'Sports', roles: ['Admin', 'Coach'] },
      { to: '/teams', label: 'Teams', roles: ['Admin', 'Coach'] },
    ],
  },
  {
    label: 'Facilities',
    items: [
      { to: '/facilities', label: 'Facilities', roles: null },
      { to: '/facility-bookings', label: 'Bookings', roles: null },
    ],
  },
  {
    label: 'Competitions',
    items: [{ to: '/competitions', label: 'Competitions', roles: null }],
  },
  {
    label: 'Reports',
    items: [{ to: '/reports', label: 'Reports', roles: null }],
  },
  {
    label: 'Administration',
    items: [{ to: '/users', label: 'Users', roles: ['Admin'] }],
  },
]

function isVisible(item, role) {
  return !item.roles || item.roles.includes(role)
}

function Sidebar() {
  const { user } = useAuth()
  const role = user?.role

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          SC
        </div>
        <span className="font-semibold text-gray-900">Sports Club</span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => isVisible(item, role))
          if (items.length === 0) return null
          return (
            <div key={group.label ?? 'root'}>
              {group.label && (
                <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
