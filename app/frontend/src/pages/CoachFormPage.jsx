import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCoach, getCoachById, updateCoach } from '../api/coaches'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const emptyForm = { firstName: '', lastName: '', specialty: '', email: '', phone: '', hireDate: '' }

function CoachFormPage() {
  const { coachId } = useParams()
  const isEditing = Boolean(coachId)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isEditing) {
      getCoachById(coachId).then((coach) =>
        setForm({
          firstName: coach.firstName,
          lastName: coach.lastName,
          specialty: coach.specialty,
          email: coach.email,
          phone: coach.phone,
          hireDate: coach.hireDate,
        }),
      )
    }
  }, [coachId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isEditing) {
        await updateCoach(coachId, form)
        navigate(`/coaches/${coachId}`)
      } else {
        const created = await createCoach(form)
        navigate(`/coaches/${created.coachId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save coach')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Coach' : 'Add Coach'} />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="specialty"
            placeholder="Specialty"
            value={form.specialty}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <label className="text-sm text-gray-600">
            Hire date
            <input
              type="date"
              name="hireDate"
              value={form.hireDate}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Coach'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default CoachFormPage
