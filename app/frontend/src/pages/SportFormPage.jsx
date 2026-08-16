import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createSport, getSportById, updateSport } from '../api/sports'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function SportFormPage() {
  const { sportId } = useParams()
  const isEditing = Boolean(sportId)
  const [form, setForm] = useState({ sportName: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isEditing) {
      getSportById(sportId).then((sport) =>
        setForm({ sportName: sport.sportName, description: sport.description || '' }),
      )
    }
  }, [sportId, isEditing])

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
        await updateSport(sportId, form)
      } else {
        await createSport(form)
      }
      navigate('/sports')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save sport')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Sport' : 'Add Sport'} />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="sportName"
            placeholder="Sport name"
            value={form.sportName}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Sport'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default SportFormPage
