import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAthleteWithMembership } from '../api/athletes'
import { getMembershipTypes } from '../api/membershipTypes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const METHODS = ['Cash', 'Card', 'BankTransfer', 'MobileMoney']

const emptyForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male',
  email: '',
  phone: '',
  typeId: '',
  startDate: '',
  paymentAmount: '',
  paymentMethod: 'Cash',
  referenceNo: '',
}

function AthleteRegistrationFormPage() {
  const [types, setTypes] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getMembershipTypes().then(setTypes)
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const selectedType = types.find((t) => String(t.typeId) === String(form.typeId))

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setSubmitting(true)
    try {
      const response = await registerAthleteWithMembership({
        ...form,
        email: form.email || null,
        typeId: Number(form.typeId),
        paymentAmount: Number(form.paymentAmount),
        referenceNo: form.referenceNo || null,
      })
      setResult(response)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete registration')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div>
        <PageHeader title="Registration Complete" subtitle="Athlete, membership, and payment created together" />
        <Card className="max-w-md space-y-2 p-5 text-sm">
          <p>
            <span className="font-medium text-gray-500">Athlete #:</span> {result.athleteId}
          </p>
          <p>
            <span className="font-medium text-gray-500">Membership #:</span> {result.membershipId}
          </p>
          <p>
            <span className="font-medium text-gray-500">Payment #:</span> {result.paymentId}
          </p>
          <p>
            <span className="font-medium text-gray-500">Amount charged:</span> GHS{' '}
            {Number(result.amountCharged).toFixed(2)}
          </p>
          <p>
            <span className="font-medium text-gray-500">Initial payment:</span> GHS{' '}
            {Number(result.initialPayment).toFixed(2)}
          </p>
        </Card>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => navigate(`/athletes/${result.athleteId}`)}>View Athlete</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setResult(null)
              setForm(emptyForm)
            }}
          >
            Register Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Register Athlete with Membership"
        subtitle="Creates the athlete, their membership, and first payment together as one transaction"
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Athlete</p>
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
            className="rounded border border-gray-300 px-3 py-2 text-sm"
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
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <p className="mt-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">Membership</p>
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
                {t.typeName} (GHS {Number(t.fee).toFixed(2)}, {t.durationMonths} mo)
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

          <p className="mt-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">First Payment</p>
          <input
            name="paymentAmount"
            type="number"
            step="0.01"
            placeholder={selectedType ? `Up to GHS ${Number(selectedType.fee).toFixed(2)}` : 'Amount'}
            value={form.paymentAmount}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            name="referenceNo"
            placeholder="Reference number (optional)"
            value={form.referenceNo}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default AthleteRegistrationFormPage
