import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteMembershipType, getMembershipTypes } from '../api/membershipTypes'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'

function MembershipTypesPage() {
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  function load() {
    getMembershipTypes().then(setTypes)
  }

  useEffect(load, [])

  async function handleDelete(typeId) {
    if (!window.confirm('Delete this membership type?')) return
    setError('')
    try {
      await deleteMembershipType(typeId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete membership type')
    }
  }

  const columns = [
    { key: 'typeName', label: 'Name' },
    { key: 'fee', label: 'Fee (GHS)', render: (row) => Number(row.fee).toFixed(2) },
    { key: 'durationMonths', label: 'Duration (months)' },
    { key: 'description', label: 'Description' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <Link to={`/membership-types/${row.typeId}/edit`} className="text-indigo-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(row.typeId)} className="text-red-600 hover:underline">
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
        title="Membership Types"
        subtitle="Fee plans available to athletes"
        action={
          isAdmin && (
            <Button as={Link} to="/membership-types/new">
              Add Membership Type
            </Button>
          )
        }
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <Card>
        <DataTable columns={columns} rows={types} emptyMessage="No membership types found." />
      </Card>
    </div>
  )
}

export default MembershipTypesPage
