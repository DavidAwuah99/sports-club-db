import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAthletes } from '../api/athletes'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'

const COLUMNS = [
  { key: 'name', label: 'Name', render: (row) => `${row.firstName} ${row.lastName}` },
  { key: 'gender', label: 'Gender' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email', render: (row) => row.email || '—' },
  { key: 'joinDate', label: 'Joined' },
]

const MEMBERSHIP_STATUSES = ['Active', 'Expired', 'Suspended']

function AthletesPage() {
  const [athletes, setAthletes] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAthletes().then(setAthletes)
  }, [])

  async function handleSearch(event) {
    event.preventDefault()
    const results = await getAthletes({
      lastName: search.trim() || undefined,
      membershipStatus: status || undefined,
    })
    setAthletes(results)
  }

  function handleStatusChange(event) {
    setStatus(event.target.value)
  }

  async function handleReset() {
    setSearch('')
    setStatus('')
    const results = await getAthletes()
    setAthletes(results)
  }

  return (
    <div>
      <PageHeader
        title="Athletes"
        subtitle="All registered athletes"
        action={
          <div className="flex gap-2">
            <Button as={Link} to="/athletes/register" variant="secondary">
              Register with Membership
            </Button>
            <Button as={Link} to="/athletes/new">
              Add Athlete
            </Button>
          </div>
        }
      />
      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by last name…"
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Any membership status</option>
          {MEMBERSHIP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {(search || status) && (
          <button type="button" onClick={handleReset} className="text-sm text-gray-500 hover:underline">
            Clear
          </button>
        )}
      </form>
      <Card>
        <DataTable
          columns={COLUMNS}
          rows={athletes}
          onRowClick={(row) => navigate(`/athletes/${row.athleteId}`)}
          emptyMessage="No athletes found."
        />
      </Card>
    </div>
  )
}

export default AthletesPage
