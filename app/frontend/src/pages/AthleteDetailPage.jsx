import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAthlete, getAthleteById } from '../api/athletes'

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

  if (!athlete) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">
        {athlete.firstName} {athlete.lastName}
      </h1>
      <p className="text-gray-500">{athlete.gender}</p>
      <p className="text-gray-500">{athlete.email}</p>
      <p className="text-gray-500">{athlete.phone}</p>
      <p className="text-gray-500">Date of birth: {athlete.dateOfBirth}</p>
      <p className="text-gray-500">Joined: {athlete.joinDate}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Link to={`/athletes/${athleteId}/edit`} className="rounded bg-gray-900 px-3 py-2 text-white">
          Edit
        </Link>
        <button onClick={handleDelete} className="rounded border border-red-600 px-3 py-2 text-red-600">
          Delete
        </button>
      </div>
    </div>
  )
}

export default AthleteDetailPage
