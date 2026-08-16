import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAthlete, getAthleteById } from '../api/athletes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function AthleteDetailPage() {
  const { athleteId } = useParams()
  const [athlete, setAthlete] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAthleteById(athleteId).then(setAthlete)
  }, [athleteId])

  async function handleDelete() {
    if (!window.confirm('Delete this athlete?')) return
    try {
      await deleteAthlete(athleteId)
      navigate('/athletes')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete athlete')
    }
  }

  if (!athlete) return <div>Loading...</div>

  return (
    <div>
      <PageHeader title={`${athlete.firstName} ${athlete.lastName}`} subtitle={athlete.gender} />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Email:</span> {athlete.email || '—'}
        </p>
        <p>
          <span className="font-medium text-gray-500">Phone:</span> {athlete.phone}
        </p>
        <p>
          <span className="font-medium text-gray-500">Date of birth:</span> {athlete.dateOfBirth}
        </p>
        <p>
          <span className="font-medium text-gray-500">Joined:</span> {athlete.joinDate}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button as={Link} to={`/athletes/${athleteId}/edit`}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default AthleteDetailPage
