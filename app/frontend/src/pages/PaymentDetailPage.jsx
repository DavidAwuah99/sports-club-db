import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePayment, getPaymentById } from '../api/payments'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function PaymentDetailPage() {
  const { paymentId } = useParams()
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getPaymentById(paymentId).then(setPayment)
  }, [paymentId])

  async function handleDelete() {
    if (!window.confirm('Delete this payment? This affects financial history — Admin only for a reason.')) return
    try {
      await deletePayment(paymentId)
      navigate('/payments')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete payment')
    }
  }

  if (!payment) return <div>Loading...</div>

  return (
    <div>
      <PageHeader
        title={`Payment #${payment.paymentId}`}
        subtitle={`Membership #${payment.membershipId}`}
        action={<Badge>{payment.status}</Badge>}
      />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Amount:</span> GHS {Number(payment.amount).toFixed(2)}
        </p>
        <p>
          <span className="font-medium text-gray-500">Method:</span> {payment.method}
        </p>
        <p>
          <span className="font-medium text-gray-500">Reference:</span> {payment.referenceNo || '—'}
        </p>
        <p>
          <span className="font-medium text-gray-500">Date:</span> {payment.paymentDate?.replace('T', ' ')}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {user?.role === 'Admin' ? (
        <div className="mt-4 flex gap-3">
          <Button as={Link} to={`/payments/${paymentId}/edit`}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-xs text-gray-400">
          Only Admin can edit or delete payments — this preserves financial history per BR7.
        </p>
      )}
    </div>
  )
}

export default PaymentDetailPage
