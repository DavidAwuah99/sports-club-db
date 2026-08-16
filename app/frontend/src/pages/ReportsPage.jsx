import { useEffect, useState } from 'react'
import {
  getActiveMembersReport,
  getOutstandingPaymentsReport,
  getUpcomingBookingsReport,
} from '../api/reports'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'

const ACTIVE_MEMBERS_COLUMNS = [
  { key: 'athleteName', label: 'Athlete' },
  { key: 'membershipType', label: 'Plan' },
  { key: 'endDate', label: 'Expires' },
  {
    key: 'daysRemaining',
    label: 'Days Remaining',
    render: (row) => (
      <Badge tone={row.daysRemaining < 0 ? 'red' : row.daysRemaining <= 7 ? 'amber' : 'green'}>
        {row.daysRemaining}
      </Badge>
    ),
  },
]

const OUTSTANDING_PAYMENTS_COLUMNS = [
  { key: 'athleteName', label: 'Athlete' },
  { key: 'phone', label: 'Phone' },
  { key: 'amount', label: 'Amount (GHS)', render: (row) => Number(row.amount).toFixed(2) },
  { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
]

const UPCOMING_BOOKINGS_COLUMNS = [
  { key: 'facilityName', label: 'Facility' },
  { key: 'teamName', label: 'Team' },
  { key: 'bookingDate', label: 'Date' },
  { key: 'timeSlot', label: 'Time' },
]

function ReportSection({ title, subtitle, columns, rows, emptyMessage }) {
  if (rows === null) return null
  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mb-2 text-sm text-gray-500">{subtitle}</p>}
      <Card>
        <DataTable columns={columns} rows={rows} emptyMessage={emptyMessage} />
      </Card>
    </div>
  )
}

function ReportsPage() {
  const [activeMembers, setActiveMembers] = useState(null)
  const [outstandingPayments, setOutstandingPayments] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState(null)

  useEffect(() => {
    getActiveMembersReport().then(setActiveMembers).catch(() => setActiveMembers(null))
    getOutstandingPaymentsReport().then(setOutstandingPayments).catch(() => setOutstandingPayments(null))
    getUpcomingBookingsReport().then(setUpcomingBookings).catch(() => setUpcomingBookings(null))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        subtitle="Live reporting views backed directly by the database (vw_active_members, vw_outstanding_payments, vw_upcoming_bookings)"
      />
      <ReportSection
        title="Active Members"
        subtitle="Athletes with a currently active membership"
        columns={ACTIVE_MEMBERS_COLUMNS}
        rows={activeMembers}
        emptyMessage="No active members."
      />
      <ReportSection
        title="Outstanding Payments"
        subtitle="Payments needing front-desk follow-up"
        columns={OUTSTANDING_PAYMENTS_COLUMNS}
        rows={outstandingPayments}
        emptyMessage="No outstanding payments."
      />
      <ReportSection
        title="Upcoming Bookings"
        subtitle="Confirmed facility bookings from today onward"
        columns={UPCOMING_BOOKINGS_COLUMNS}
        rows={upcomingBookings}
        emptyMessage="No upcoming bookings."
      />
    </div>
  )
}

export default ReportsPage
