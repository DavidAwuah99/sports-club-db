import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFacilities } from '../api/facilities'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const COLUMNS = [
  { key: 'facilityName', label: 'Facility' },
  { key: 'facilityType', label: 'Type' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
]

function FacilitiesPage() {
  const [facilities, setFacilities] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getFacilities().then(setFacilities)
  }, [])

  return (
    <div>
      <PageHeader
        title="Facilities"
        subtitle="Courts, fields, and other bookable spaces"
        action={
          user?.role === 'Admin' && (
            <Button as={Link} to="/facilities/new">
              Add Facility
            </Button>
          )
        }
      />
      <Card>
        <DataTable
          columns={COLUMNS}
          rows={facilities}
          onRowClick={(row) => navigate(`/facilities/${row.facilityId}`)}
          emptyMessage="No facilities found."
        />
      </Card>
    </div>
  )
}

export default FacilitiesPage
