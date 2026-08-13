import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import AthletesPage from './pages/AthletesPage'
import AthleteDetailPage from './pages/AthleteDetailPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import CompetitionsPage from './pages/CompetitionsPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/athletes/:athleteId" element={<AthleteDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamDetailPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
