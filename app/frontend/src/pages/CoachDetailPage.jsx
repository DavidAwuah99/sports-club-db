import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCoach, getCoachById } from '../api/coaches'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function CoachDetailPage() {
  const { coachId } = useParams()
  const [coach, setCoach] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCoachById(coachId).then(setCoach)
  }, [coachId])

  async function handleDelete() {
    if (!window.confirm('Delete this coach?')) return
    try {
      await deleteCoach(coachId)
      navigate('/coaches')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete coach')
    }
  }

  if (!coach) return <div>Loading...</div>

  return (
    <div>
      <PageHeader title={`${coach.firstName} ${coach.lastName}`} subtitle={coach.specialty} />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Email:</span> {coach.email}
        </p>
        <p>
          <span className="font-medium text-gray-500">Phone:</span> {coach.phone}
        </p>
        <p>
          <span className="font-medium text-gray-500">Hired:</span> {coach.hireDate}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {user?.role === 'Admin' && (
        <div className="mt-4 flex gap-3">
          <Button as={Link} to={`/coaches/${coachId}/edit`}>
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

export default CoachDetailPage
