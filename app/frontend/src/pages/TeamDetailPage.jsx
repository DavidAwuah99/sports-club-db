import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeamById } from '../api/teams'
import { getSports } from '../api/sports'
import { getCoaches } from '../api/coaches'
import { getAthletes } from '../api/athletes'
import { getTeamRosters } from '../api/teamRosters'
import { getCompetitions } from '../api/competitions'
import { getTeamCompetitions } from '../api/teamCompetitions'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function TeamDetailPage() {
  const { teamId } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [sportName, setSportName] = useState('')
  const [coachName, setCoachName] = useState('')
  const [roster, setRoster] = useState([])
  const [athleteNames, setAthleteNames] = useState({})
  const [teamCompetitions, setTeamCompetitions] = useState([])
  const [competitionNames, setCompetitionNames] = useState({})

  useEffect(() => {
    getTeamById(teamId).then((t) => {
      setTeam(t)
      getSports().then((sports) => {
        const s = sports.find((x) => x.sportId === t.sportId)
        setSportName(s ? s.sportName : `#${t.sportId}`)
      })
      getCoaches().then((coaches) => {
        const c = coaches.find((x) => x.coachId === t.coachId)
        setCoachName(c ? `${c.firstName} ${c.lastName}` : `#${t.coachId}`)
      })
    })

    getAthletes().then((athletes) => {
      const map = {}
      athletes.forEach((a) => (map[a.athleteId] = `${a.firstName} ${a.lastName}`))
      setAthleteNames(map)
    })
    getTeamRosters().then((rows) =>
      setRoster(rows.filter((r) => String(r.teamId) === String(teamId))),
    )

    getCompetitions().then((competitions) => {
      const map = {}
      competitions.forEach((c) => (map[c.competitionId] = c.compName))
      setCompetitionNames(map)
    })
    getTeamCompetitions().then((rows) =>
      setTeamCompetitions(rows.filter((r) => String(r.teamId) === String(teamId))),
    )
  }, [teamId])

  if (!team) return <div>Loading...</div>

  const rosterColumns = [
    { key: 'athlete', label: 'Athlete', render: (row) => athleteNames[row.athleteId] || `#${row.athleteId}` },
    { key: 'position', label: 'Position', render: (row) => row.position || '—' },
    { key: 'dateJoined', label: 'Joined' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => <Badge tone={row.isActive ? 'green' : 'gray'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
  ]

  const competitionColumns = [
    {
      key: 'competition',
      label: 'Competition',
      render: (row) => competitionNames[row.competitionId] || `#${row.competitionId}`,
    },
    { key: 'registrationDate', label: 'Registered' },
    { key: 'finalPosition', label: 'Final Position', render: (row) => row.finalPosition ?? '—' },
    { key: 'pointsScored', label: 'Points', render: (row) => row.pointsScored ?? '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={team.teamName} subtitle={`${sportName} · Coach ${coachName}`} />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Roster</h2>
          {user?.role === 'Admin' && (
            <Button as={Link} to={`/teams/${teamId}/roster/new`} variant="secondary">
              Add to Roster
            </Button>
          )}
        </div>
        <Card>
          <DataTable columns={rosterColumns} rows={roster} emptyMessage="No athletes on this roster." />
        </Card>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Competitions Entered
        </h2>
        <Card>
          <DataTable
            columns={competitionColumns}
            rows={teamCompetitions}
            emptyMessage="Not registered for any competitions."
          />
        </Card>
      </div>
    </div>
  )
}

export default TeamDetailPage
