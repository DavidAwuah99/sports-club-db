import { useEffect, useState } from 'react'
import { getUsers } from '../api/users'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'

const COLUMNS = [
  { key: 'username', label: 'Username' },
  { key: 'role', label: 'Role', render: (row) => <Badge tone="blue">{row.role}</Badge> },
  {
    key: 'isActive',
    label: 'Status',
    render: (row) => <Badge tone={row.isActive ? 'green' : 'gray'}>{row.isActive ? 'Active' : 'Disabled'}</Badge>,
  },
  { key: 'lastLogin', label: 'Last login', render: (row) => (row.lastLogin ? row.lastLogin.replace('T', ' ') : 'Never') },
]

function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  return (
    <div>
      <PageHeader title="Users" subtitle="Application accounts and roles" />
      <Card>
        <DataTable columns={COLUMNS} rows={users} emptyMessage="No users found." />
      </Card>
    </div>
  )
}

export default UsersPage
