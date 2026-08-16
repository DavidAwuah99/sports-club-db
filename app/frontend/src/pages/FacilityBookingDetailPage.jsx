import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteFacilityBooking, getFacilityBookingById } from '../api/facilityBookings'
import { getFacilityById } from '../api/facilities'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
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

function FacilityBookingDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [facility, setFacility] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getFacilityBookingById(bookingId).then((b) => {
      setBooking(b)
      getFacilityById(b.facilityId).then(setFacility)
    })
  }, [bookingId])

  async function handleDelete() {
    if (!window.confirm('Delete this booking?')) return
    try {
      await deleteFacilityBooking(bookingId)
      navigate('/facility-bookings')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete booking')
    }
  }

  if (!booking) return <div>Loading...</div>

  return (
    <div>
      <PageHeader
        title={facility ? facility.facilityName : `Booking #${booking.bookingId}`}
        subtitle={`${booking.bookingDate} · ${SLOT_LABELS[booking.timeSlot] || booking.timeSlot}`}
        action={<Badge>{booking.status}</Badge>}
      />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Purpose:</span> {booking.purpose || '—'}
        </p>
        <p>
          <span className="font-medium text-gray-500">Created:</span>{' '}
          {booking.createdAt?.replace('T', ' ')}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {user?.role === 'Admin' && (
        <div className="mt-4 flex gap-3">
          <Button as={Link} to={`/facility-bookings/${bookingId}/edit`}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

export default FacilityBookingDetailPage
