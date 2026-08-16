import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPayments } from '../api/payments'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const COLUMNS = [
  { key: 'membershipId', label: 'Membership #' },
  { key: 'amount', label: 'Amount (GHS)', render: (row) => Number(row.amount).toFixed(2) },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  { key: 'paymentDate', label: 'Date', render: (row) => row.paymentDate?.replace('T', ' ') },
]

function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getPayments().then(setPayments)
  }, [])

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Payment history across all memberships"
        action={
          <Button as={Link} to="/payments/new">
            Record Payment
          </Button>
        }
      />
      <Card>
        <DataTable
          columns={COLUMNS}
          rows={payments}
          onRowClick={(row) => navigate(`/payments/${row.paymentId}`)}
          emptyMessage="No payments found."
        />
      </Card>
    </div>
  )
}

export default PaymentsPage
