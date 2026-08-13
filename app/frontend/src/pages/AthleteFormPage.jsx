import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createAthlete, getAthleteById, updateAthlete } from '../api/athletes'

const emptyForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male',
  email: '',
  phone: '',
}

function AthleteFormPage() {
  const { athleteId } = useParams()
  const isEditing = Boolean(athleteId)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing) {
      getAthleteById(athleteId).then((athlete) =>
        setForm({
          firstName: athlete.firstName,
          lastName: athlete.lastName,
          dateOfBirth: athlete.dateOfBirth,
          gender: athlete.gender,
          email: athlete.email || '',
          phone: athlete.phone,
        }),
      )
    }
  }, [athleteId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, email: form.email || null }
      if (isEditing) {
        await updateAthlete(athleteId, payload)
        navigate(`/athletes/${athleteId}`)
      } else {
        const created = await createAthlete(payload)
        navigate(`/athletes/${created.athleteId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save athlete')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        {isEditing ? 'Edit Athlete' : 'Add Athlete'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        <label className="text-sm text-gray-600">
          Date of birth
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="rounded border border-gray-300 px-3 py-2"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-gray-900 px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default AthleteFormPage
