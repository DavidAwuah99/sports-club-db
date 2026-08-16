import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTeams } from '../api/teams'
import { getSports } from '../api/sports'
import { getCoaches } from '../api/coaches'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'

function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [sportNames, setSportNames] = useState({})
  const [coachNames, setCoachNames] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getTeams().then(setTeams)
    getSports().then((sports) => {
      const map = {}
      sports.forEach((s) => (map[s.sportId] = s.sportName))
      setSportNames(map)
    })
    getCoaches().then((coaches) => {
      const map = {}
      coaches.forEach((c) => (map[c.coachId] = `${c.firstName} ${c.lastName}`))
      setCoachNames(map)
    })
  }, [])

  const columns = [
    { key: 'teamName', label: 'Team' },
    { key: 'sport', label: 'Sport', render: (row) => sportNames[row.sportId] || `#${row.sportId}` },
    { key: 'coach', label: 'Coach', render: (row) => coachNames[row.coachId] || `#${row.coachId}` },
    { key: 'foundedDate', label: 'Founded' },
  ]

  return (
    <div>
      <PageHeader title="Teams" subtitle="Club teams across all sports" />
      <Card>
        <DataTable
          columns={columns}
          rows={teams}
          onRowClick={(row) => navigate(`/teams/${row.teamId}`)}
          emptyMessage="No teams found."
        />
      </Card>
    </div>
  )
}

export default TeamsPage
