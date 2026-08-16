import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTeamRoster } from '../api/teamRosters'
import { getAthletes } from '../api/athletes'
import { getTeamById } from '../api/teams'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function TeamRosterFormPage() {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)
  const [athletes, setAthletes] = useState([])
  const [form, setForm] = useState({ athleteId: '', position: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getTeamById(teamId).then(setTeam)
    getAthletes().then(setAthletes)
  }, [teamId])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createTeamRoster({
        teamId: Number(teamId),
        athleteId: Number(form.athleteId),
        position: form.position || null,
      })
      navigate(`/teams/${teamId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add athlete to roster')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Add Athlete to Roster"
        subtitle={team ? team.teamName : `Team #${teamId}`}
      />
      <Card className="max-w-md p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="athleteId"
            value={form.athleteId}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select athlete…</option>
            {athletes.map((a) => (
              <option key={a.athleteId} value={a.athleteId}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </select>
          <input
            name="position"
            placeholder="Position (optional)"
            value={form.position}
            onChange={handleChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add to Roster'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default TeamRosterFormPage
