const TONES = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
}

const STATUS_TONE = {
  Active: 'green',
  Confirmed: 'green',
  Completed: 'green',
  Expired: 'gray',
  Cancelled: 'gray',
  Suspended: 'amber',
  Pending: 'amber',
  Failed: 'red',
  Refunded: 'blue',
  Maintenance: 'amber',
  Closed: 'red',
  Available: 'green',
}

function Badge({ children, tone }) {
  const resolvedTone = tone || STATUS_TONE[children] || 'gray'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[resolvedTone]}`}
    >
      {children}
    </span>
  )
}

export default Badge
