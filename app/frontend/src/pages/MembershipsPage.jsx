import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMemberships } from '../api/memberships'
import { getAthletes } from '../api/athletes'
import { getMembershipTypes } from '../api/membershipTypes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function MembershipsPage() {
  const [memberships, setMemberships] = useState([])
  const [athleteNames, setAthleteNames] = useState({})
  const [typeNames, setTypeNames] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getMemberships().then(setMemberships)
    getAthletes().then((athletes) => {
      const map = {}
      athletes.forEach((a) => (map[a.athleteId] = `${a.firstName} ${a.lastName}`))
      setAthleteNames(map)
    })
    getMembershipTypes().then((types) => {
      const map = {}
      types.forEach((t) => (map[t.typeId] = t.typeName))
      setTypeNames(map)
    })
  }, [])

  const columns = [
    { key: 'athlete', label: 'Athlete', render: (row) => athleteNames[row.athleteId] || `#${row.athleteId}` },
    { key: 'type', label: 'Type', render: (row) => typeNames[row.typeId] || `#${row.typeId}` },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate', label: 'End' },
    { key: 'amountCharged', label: 'Amount (GHS)', render: (row) => Number(row.amountCharged).toFixed(2) },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader
        title="Memberships"
        subtitle="Membership subscriptions per athlete"
        action={
          <Button as={Link} to="/memberships/new">
            New Membership
          </Button>
        }
      />
      <Card>
        <DataTable
          columns={columns}
          rows={memberships}
          onRowClick={(row) => navigate(`/memberships/${row.membershipId}`)}
          emptyMessage="No memberships found."
        />
      </Card>
    </div>
  )
}

export default MembershipsPage
