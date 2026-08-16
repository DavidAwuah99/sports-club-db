import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createMembership, getMembershipById, updateMembership } from '../api/memberships'
import { getAthletes } from '../api/athletes'
import { getMembershipTypes } from '../api/membershipTypes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function MembershipFormPage() {
  const { membershipId } = useParams()
  const isEditing = Boolean(membershipId)
  const [athletes, setAthletes] = useState([])
  const [types, setTypes] = useState([])
  const [form, setForm] = useState({
    athleteId: '',
    typeId: '',
    startDate: '',
    endDate: '',
    amountCharged: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAthletes().then(setAthletes)
    getMembershipTypes().then(setTypes)
    if (isEditing) {
      getMembershipById(membershipId).then((m) =>
        setForm({
          athleteId: m.athleteId,
          typeId: m.typeId,
          startDate: m.startDate,
          endDate: m.endDate,
          amountCharged: m.amountCharged,
        }),
      )
    }
  }, [membershipId, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        athleteId: Number(form.athleteId),
        typeId: Number(form.typeId),
        amountCharged: Number(form.amountCharged),
      }
      if (isEditing) {
        await updateMembership(membershipId, payload)
        navigate(`/memberships/${membershipId}`)
      } else {
        const created = await createMembership(payload)
        navigate(`/memberships/${created.membershipId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save membership')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Membership' : 'New Membership'}
        subtitle="Membership subscription for an athlete"
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="athleteId"
            value={form.athleteId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select athlete…</option>
            {athletes.map((a) => (
              <option key={a.athleteId} value={a.athleteId}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </select>
          <select
            name="typeId"
            value={form.typeId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select membership type…</option>
            {types.map((t) => (
              <option key={t.typeId} value={t.typeId}>
                {t.typeName} (GHS {Number(t.fee).toFixed(2)})
              </option>
            ))}
          </select>
          <label className="text-sm text-gray-600">
            Start date
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm text-gray-600">
            End date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <input
            name="amountCharged"
            type="number"
            step="0.01"
            placeholder="Amount charged"
            value={form.amountCharged}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Membership'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default MembershipFormPage
