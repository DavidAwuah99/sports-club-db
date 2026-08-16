import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteFacility, getFacilityById } from '../api/facilities'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function FacilityDetailPage() {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getFacilityById(facilityId).then(setFacility)
  }, [facilityId])

  async function handleDelete() {
    if (!window.confirm('Delete this facility?')) return
    try {
      await deleteFacility(facilityId)
      navigate('/facilities')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete facility')
    }
  }

  if (!facility) return <div>Loading...</div>

  return (
    <div>
      <PageHeader
        title={facility.facilityName}
        subtitle={facility.facilityType}
        action={<Badge>{facility.status}</Badge>}
      />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Capacity:</span> {facility.capacity}
        </p>
        <p>
          <span className="font-medium text-gray-500">Location:</span> {facility.location}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {user?.role === 'Admin' && (
        <div className="mt-4 flex gap-3">
          <Button as={Link} to={`/facilities/${facilityId}/edit`}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

export default FacilityDetailPage
