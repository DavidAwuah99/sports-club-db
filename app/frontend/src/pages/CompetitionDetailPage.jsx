import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCompetitions } from '../api/competitions'
import { getTeams } from '../api/teams'
import { getTeamCompetitions } from '../api/teamCompetitions'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function CompetitionDetailPage() {
  const { competitionId } = useParams()
  const { user } = useAuth()
  const [competition, setCompetition] = useState(null)
  const [entries, setEntries] = useState([])
  const [teamNames, setTeamNames] = useState({})

  useEffect(() => {
    getCompetitions().then((competitions) =>
      setCompetition(competitions.find((c) => String(c.competitionId) === String(competitionId))),
    )
    getTeams().then((teams) => {
      const map = {}
      teams.forEach((t) => (map[t.teamId] = t.teamName))
      setTeamNames(map)
    })
    getTeamCompetitions().then((rows) =>
      setEntries(rows.filter((r) => String(r.competitionId) === String(competitionId))),
    )
  }, [competitionId])

  if (!competition) return <div>Loading...</div>

  const columns = [
    { key: 'team', label: 'Team', render: (row) => teamNames[row.teamId] || `#${row.teamId}` },
    { key: 'registrationDate', label: 'Registered' },
    { key: 'finalPosition', label: 'Final Position', render: (row) => row.finalPosition ?? '—' },
    { key: 'pointsScored', label: 'Points', render: (row) => row.pointsScored ?? '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={competition.compName}
        subtitle={`${competition.compDate} · ${competition.venue || 'Venue TBD'}`}
        action={<Badge tone="blue">{competition.level}</Badge>}
      />
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Registered Teams
          </h2>
          {user?.role === 'Admin' && (
            <Button as={Link} to={`/competitions/${competitionId}/register/new`} variant="secondary">
              Register Team
            </Button>
          )}
        </div>
        <Card>
          <DataTable columns={columns} rows={entries} emptyMessage="No teams registered yet." />
        </Card>
      </div>
    </div>
  )
}

export default CompetitionDetailPage
