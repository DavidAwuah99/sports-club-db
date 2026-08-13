import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAthletes } from '../api/athletes'
import AthleteList from '../components/athletes/AthleteList'

function AthletesPage() {
  const [athletes, setAthletes] = useState([])

  useEffect(() => {
    getAthletes().then(setAthletes)
  }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Athletes</h1>
        <Link to="/athletes/new" className="rounded bg-gray-900 px-3 py-2 text-white">
          Add Athlete
        </Link>
      </div>
      <AthleteList athletes={athletes} />
    </div>
  )
}

export default AthletesPage
