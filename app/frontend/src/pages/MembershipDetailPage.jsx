import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteMembership, getMembershipById } from '../api/memberships'
import { getAthleteById } from '../api/athletes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function MembershipDetailPage() {
  const { membershipId } = useParams()
  const [membership, setMembership] = useState(null)
  const [athlete, setAthlete] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMembershipById(membershipId).then((m) => {
      setMembership(m)
      getAthleteById(m.athleteId).then(setAthlete)
    })
  }, [membershipId])

  async function handleDelete() {
    if (!window.confirm('Delete this membership?')) return
    try {
      await deleteMembership(membershipId)
      navigate('/memberships')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete membership')
    }
  }

  if (!membership) return <div>Loading...</div>

  return (
    <div>
      <PageHeader
        title={athlete ? `${athlete.firstName} ${athlete.lastName}` : `Membership #${membership.membershipId}`}
        subtitle="Membership details"
        action={<Badge>{membership.status}</Badge>}
      />
      <Card className="max-w-md space-y-2 p-5 text-sm">
        <p>
          <span className="font-medium text-gray-500">Start date:</span> {membership.startDate}
        </p>
        <p>
          <span className="font-medium text-gray-500">End date:</span> {membership.endDate}
        </p>
        <p>
          <span className="font-medium text-gray-500">Amount charged:</span> GHS{' '}
          {Number(membership.amountCharged).toFixed(2)}
        </p>
      </Card>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-4 flex gap-3">
        <Button as={Link} to={`/memberships/${membershipId}/edit`}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default MembershipDetailPage
