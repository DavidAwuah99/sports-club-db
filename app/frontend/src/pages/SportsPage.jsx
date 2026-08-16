import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteSport, getSports } from '../api/sports'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'

function SportsPage() {
  const [sports, setSports] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  function load() {
    getSports().then(setSports)
  }

  useEffect(load, [])

  async function handleDelete(sportId) {
    if (!window.confirm('Delete this sport?')) return
    setError('')
    try {
      await deleteSport(sportId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete sport')
    }
  }

  const columns = [
    { key: 'sportName', label: 'Sport' },
    { key: 'description', label: 'Description' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <Link to={`/sports/${row.sportId}/edit`} className="text-indigo-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(row.sportId)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <div>
      <PageHeader
        title="Sports"
        subtitle="Sports offered by the club"
        action={
          isAdmin && (
            <Button as={Link} to="/sports/new">
              Add Sport
            </Button>
          )
        }
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <Card>
        <DataTable columns={columns} rows={sports} emptyMessage="No sports found." />
      </Card>
    </div>
  )
}

export default SportsPage
