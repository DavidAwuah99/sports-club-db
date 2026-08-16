import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createMembershipType, getMembershipTypeById, updateMembershipType } from '../api/membershipTypes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function MembershipTypeFormPage() {
  const { typeId } = useParams()
  const isEditing = Boolean(typeId)
  const [form, setForm] = useState({ typeName: '', fee: '', durationMonths: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isEditing) {
      getMembershipTypeById(typeId).then((t) =>
        setForm({
          typeName: t.typeName,
          fee: t.fee,
          durationMonths: t.durationMonths,
          description: t.description || '',
        }),
      )
    }
  }, [typeId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, fee: Number(form.fee), durationMonths: Number(form.durationMonths) }
      if (isEditing) {
        await updateMembershipType(typeId, payload)
      } else {
        await createMembershipType(payload)
      }
      navigate('/membership-types')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save membership type')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={isEditing ? 'Edit Membership Type' : 'Add Membership Type'} />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="typeName"
            placeholder="Type name"
            value={form.typeName}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="fee"
            type="number"
            step="0.01"
            placeholder="Fee (GHS)"
            value={form.fee}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="durationMonths"
            type="number"
            placeholder="Duration (months)"
            value={form.durationMonths}
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
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Membership Type'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default MembershipTypeFormPage
