import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCoaches } from '../api/coaches'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'

const COLUMNS = [
  { key: 'name', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
  { key: 'specialty', label: 'Specialty' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'hireDate', label: 'Hired' },
]

function CoachesPage() {
  const [coaches, setCoaches] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCoaches().then(setCoaches)
  }, [])

  return (
    <div>
      <PageHeader
        title="Coaches"
        subtitle="Coaching staff across all teams"
        action={
          user?.role === 'Admin' && (
            <Button as={Link} to="/coaches/new">
              Add Coach
            </Button>
          )
        }
      />
      <Card>
        <DataTable
          columns={COLUMNS}
          rows={coaches}
          onRowClick={(row) => navigate(`/coaches/${row.coachId}`)}
          emptyMessage="No coaches found."
        />
      </Card>
    </div>
  )
}

export default CoachesPage
