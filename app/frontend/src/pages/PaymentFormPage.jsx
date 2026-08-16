import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPayment, getPaymentById, updatePayment } from '../api/payments'
import { getMemberships } from '../api/memberships'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const METHODS = ['Cash', 'Card', 'BankTransfer', 'MobileMoney']

function PaymentFormPage() {
  const { paymentId } = useParams()
  const isEditing = Boolean(paymentId)
  const [memberships, setMemberships] = useState([])
  const [form, setForm] = useState({
    membershipId: '',
    amount: '',
    method: 'Cash',
    referenceNo: '',
    paymentDate: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getMemberships().then(setMemberships)
    if (isEditing) {
      getPaymentById(paymentId).then((p) =>
        setForm({
          membershipId: p.membershipId,
          amount: p.amount,
          method: p.method,
          referenceNo: p.referenceNo || '',
          paymentDate: p.paymentDate,
        }),
      )
    }
  }, [paymentId, isEditing])

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
        membershipId: Number(form.membershipId),
        amount: Number(form.amount),
        method: form.method,
        referenceNo: form.referenceNo || null,
        paymentDate: isEditing ? form.paymentDate : new Date().toISOString(),
      }
      if (isEditing) {
        await updatePayment(paymentId, payload)
        navigate(`/payments/${paymentId}`)
      } else {
        const created = await createPayment(payload)
        navigate(`/payments/${created.paymentId}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save payment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Payment' : 'Record Payment'}
        subtitle="Payment against a membership"
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="membershipId"
            value={form.membershipId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select membership…</option>
            {memberships.map((m) => (
              <option key={m.membershipId} value={m.membershipId}>
                #{m.membershipId} — athlete {m.athleteId} (GHS {Number(m.amountCharged).toFixed(2)} charged)
              </option>
            ))}
          </select>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <select
            name="method"
            value={form.method}
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
            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Record Payment'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default PaymentFormPage
