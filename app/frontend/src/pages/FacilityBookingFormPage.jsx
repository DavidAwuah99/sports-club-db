import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createFacilityBooking, getFacilityBookingById, updateFacilityBooking } from '../api/facilityBookings'
import { getFacilities } from '../api/facilities'
import { getTeams } from '../api/teams'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const SLOTS = [
  ['SLOT_06_08', '06:00–08:00'],
  ['SLOT_08_10', '08:00–10:00'],
  ['SLOT_10_12', '10:00–12:00'],
  ['SLOT_12_14', '12:00–14:00'],
  ['SLOT_14_16', '14:00–16:00'],
  ['SLOT_16_18', '16:00–18:00'],
  ['SLOT_18_20', '18:00–20:00'],
  ['SLOT_20_22', '20:00–22:00'],
]

function FacilityBookingFormPage() {
  const { bookingId } = useParams()
  const isEditing = Boolean(bookingId)
  const [facilities, setFacilities] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState({
    facilityId: '',
    teamId: '',
    bookingDate: '',
    timeSlot: 'SLOT_06_08',
    purpose: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getFacilities().then(setFacilities)
    getTeams().then(setTeams)
    if (isEditing) {
      getFacilityBookingById(bookingId).then((b) =>
        setForm({
          facilityId: b.facilityId,
          teamId: b.teamId,
          bookingDate: b.bookingDate,
          timeSlot: b.timeSlot,
          purpose: b.purpose || '',
        }),
      )
    }
  }, [bookingId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, facilityId: Number(form.facilityId), teamId: Number(form.teamId) }
      if (isEditing) {
        await updateFacilityBooking(bookingId, payload)
        navigate(`/facility-bookings/${bookingId}`)
      } else {
        const created = await createFacilityBooking(payload)
        navigate(`/facility-bookings/${created.bookingId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Facility Booking' : 'New Facility Booking'}
        subtitle="Reserve a facility for a team"
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="facilityId"
            value={form.facilityId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select facility…</option>
            {facilities.map((f) => (
              <option key={f.facilityId} value={f.facilityId}>
                {f.facilityName}
              </option>
            ))}
          </select>
          <select
            name="teamId"
            value={form.teamId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select team…</option>
            {teams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.teamName}
              </option>
            ))}
          </select>
          <label className="text-sm text-gray-600">
            Booking date
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {SLOTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            name="purpose"
            placeholder="Purpose (optional)"
            value={form.purpose}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Booking'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default FacilityBookingFormPage
