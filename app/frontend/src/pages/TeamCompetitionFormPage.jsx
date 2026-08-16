import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTeamCompetition } from '../api/teamCompetitions'
import { getTeams } from '../api/teams'
import { getCompetitions } from '../api/competitions'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function TeamCompetitionFormPage() {
  const { competitionId } = useParams()
  const [competition, setCompetition] = useState(null)
  const [teams, setTeams] = useState([])
  const [teamId, setTeamId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getCompetitions().then((competitions) =>
      setCompetition(competitions.find((c) => String(c.competitionId) === String(competitionId))),
    )
    getTeams().then(setTeams)
  }, [competitionId])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createTeamCompetition({
        teamId: Number(teamId),
        competitionId: Number(competitionId),
      })
      navigate(`/competitions/${competitionId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register team')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Register Team for Competition"
        subtitle={competition ? competition.compName : `Competition #${competitionId}`}
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={teamId}
            onChange={(event) => setTeamId(event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select team…</option>
            {teams.map((t) => (
              <option key={t.teamId} value={t.teamId}>
                {t.teamName}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Register Team'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default TeamCompetitionFormPage
