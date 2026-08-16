import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFacilityBookings } from '../api/facilityBookings'
import { getFacilities } from '../api/facilities'
import { getTeams } from '../api/teams'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const SLOT_LABELS = {
  SLOT_06_08: '06:00–08:00',
  SLOT_08_10: '08:00–10:00',
  SLOT_10_12: '10:00–12:00',
  SLOT_12_14: '12:00–14:00',
  SLOT_14_16: '14:00–16:00',
  SLOT_16_18: '16:00–18:00',
  SLOT_18_20: '18:00–20:00',
  SLOT_20_22: '20:00–22:00',
}

function FacilityBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [facilityNames, setFacilityNames] = useState({})
  const [teamNames, setTeamNames] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getFacilityBookings().then(setBookings)
    getFacilities().then((facilities) => {
      const map = {}
      facilities.forEach((f) => (map[f.facilityId] = f.facilityName))
      setFacilityNames(map)
    })
    getTeams().then((teams) => {
      const map = {}
      teams.forEach((t) => (map[t.teamId] = t.teamName))
      setTeamNames(map)
    })
  }, [])

  const columns = [
    { key: 'facility', label: 'Facility', render: (row) => facilityNames[row.facilityId] || `#${row.facilityId}` },
    { key: 'team', label: 'Team', render: (row) => teamNames[row.teamId] || `#${row.teamId}` },
    { key: 'bookingDate', label: 'Date' },
    { key: 'timeSlot', label: 'Time', render: (row) => SLOT_LABELS[row.timeSlot] || row.timeSlot },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader
        title="Facility Bookings"
        subtitle="Scheduled use of club facilities"
        action={
          <Button as={Link} to="/facility-bookings/new">
            New Booking
          </Button>
        }
      />
      <Card>
        <DataTable
          columns={columns}
          rows={bookings}
          onRowClick={(row) => navigate(`/facility-bookings/${row.bookingId}`)}
          emptyMessage="No bookings found."
        />
      </Card>
    </div>
  )
}

export default FacilityBookingsPage
