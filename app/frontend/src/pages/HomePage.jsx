import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getActiveMembersReport, getOutstandingPaymentsReport, getUpcomingBookingsReport } from '../api/reports'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

function StatCard({ label, value, sub, tone }) {
  const toneClasses = {
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  }
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {sub && <p className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>{sub}</p>}
    </Card>
  )
}

function HomePage() {
  const { user } = useAuth()
  const [activeMembers, setActiveMembers] = useState(null)
  const [outstandingPayments, setOutstandingPayments] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState(null)

  useEffect(() => {
    getActiveMembersReport().then(setActiveMembers).catch(() => setActiveMembers(null))
    getOutstandingPaymentsReport().then(setOutstandingPayments).catch(() => setOutstandingPayments(null))
    getUpcomingBookingsReport().then(setUpcomingBookings).catch(() => setUpcomingBookings(null))
  }, [])

  const outstandingTotal = (outstandingPayments || []).reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.username || ''}`}
        subtitle="Sports Club Management System — overview"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {activeMembers !== null && (
          <StatCard label="Active Members" value={activeMembers.length} tone="indigo" />
        )}
        {outstandingPayments !== null && (
          <StatCard
            label="Outstanding Payments"
            value={outstandingPayments.length}
            sub={`GHS ${outstandingTotal.toFixed(2)} pending`}
            tone="amber"
          />
        )}
        {upcomingBookings !== null && (
          <StatCard label="Upcoming Bookings" value={upcomingBookings.length} tone="blue" />
        )}
      </div>
    </div>
  )
}

export default HomePage
