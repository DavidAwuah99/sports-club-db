import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCompetitions } from '../api/competitions'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'

const COLUMNS = [
  { key: 'compName', label: 'Competition' },
  { key: 'level', label: 'Level', render: (row) => <Badge tone="blue">{row.level}</Badge> },
  { key: 'compDate', label: 'Date' },
  { key: 'venue', label: 'Venue', render: (row) => row.venue || '—' },
]

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getCompetitions().then(setCompetitions)
  }, [])

  return (
    <div>
      <PageHeader title="Competitions" subtitle="Upcoming and past competitions" />
      <Card>
        <DataTable
          columns={COLUMNS}
          rows={competitions}
          onRowClick={(row) => navigate(`/competitions/${row.competitionId}`)}
          emptyMessage="No competitions found."
        />
      </Card>
    </div>
  )
}

export default CompetitionsPage
