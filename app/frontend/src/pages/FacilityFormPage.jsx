import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createFacility, getFacilityById, updateFacility } from '../api/facilities'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const FACILITY_TYPES = ['Court', 'Field', 'Pool', 'Gym', 'Track', 'Hall']
const STATUSES = ['Available', 'Maintenance', 'Closed']

const emptyForm = { facilityName: '', facilityType: 'Court', capacity: '', location: '', status: 'Available' }

function FacilityFormPage() {
  const { facilityId } = useParams()
  const isEditing = Boolean(facilityId)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isEditing) {
      getFacilityById(facilityId).then((f) =>
        setForm({
          facilityName: f.facilityName,
          facilityType: f.facilityType,
          capacity: f.capacity,
          location: f.location || '',
          status: f.status,
        }),
      )
    }
  }, [facilityId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      if (isEditing) {
        await updateFacility(facilityId, payload)
        navigate(`/facilities/${facilityId}`)
      } else {
        const created = await createFacility(payload)
        navigate(`/facilities/${created.facilityId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save facility')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Facility' : 'Add Facility'} />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="facilityName"
            placeholder="Facility name"
            value={form.facilityName}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <select
            name="facilityType"
            value={form.facilityType}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {FACILITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="location"
            placeholder="Location (optional)"
            value={form.location}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Facility'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default FacilityFormPage
