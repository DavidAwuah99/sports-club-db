import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AthletesPage from './pages/AthletesPage'
import AthleteDetailPage from './pages/AthleteDetailPage'
import AthleteFormPage from './pages/AthleteFormPage'
import AthleteRegistrationFormPage from './pages/AthleteRegistrationFormPage'
import CoachesPage from './pages/CoachesPage'
import CoachDetailPage from './pages/CoachDetailPage'
import CoachFormPage from './pages/CoachFormPage'
import MembershipTypesPage from './pages/MembershipTypesPage'
import MembershipTypeFormPage from './pages/MembershipTypeFormPage'
import MembershipsPage from './pages/MembershipsPage'
import MembershipDetailPage from './pages/MembershipDetailPage'
import MembershipFormPage from './pages/MembershipFormPage'
import PaymentsPage from './pages/PaymentsPage'
import PaymentDetailPage from './pages/PaymentDetailPage'
import PaymentFormPage from './pages/PaymentFormPage'
import SportsPage from './pages/SportsPage'
import SportFormPage from './pages/SportFormPage'
import ReportsPage from './pages/ReportsPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import FacilitiesPage from './pages/FacilitiesPage'
import FacilityDetailPage from './pages/FacilityDetailPage'
import FacilityFormPage from './pages/FacilityFormPage'
import FacilityBookingsPage from './pages/FacilityBookingsPage'
import FacilityBookingDetailPage from './pages/FacilityBookingDetailPage'
import FacilityBookingFormPage from './pages/FacilityBookingFormPage'
import CompetitionsPage from './pages/CompetitionsPage'
import CompetitionDetailPage from './pages/CompetitionDetailPage'
import TeamRosterFormPage from './pages/TeamRosterFormPage'
import TeamCompetitionFormPage from './pages/TeamCompetitionFormPage'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomePage />} />

          <Route path="/athletes" element={<AthletesPage />} />
          <Route path="/athletes/new" element={<AthleteFormPage />} />
          <Route path="/athletes/register" element={<AthleteRegistrationFormPage />} />
          <Route path="/athletes/:athleteId" element={<AthleteDetailPage />} />
          <Route path="/athletes/:athleteId/edit" element={<AthleteFormPage />} />

          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/coaches/new" element={<CoachFormPage />} />
          <Route path="/coaches/:coachId" element={<CoachDetailPage />} />
          <Route path="/coaches/:coachId/edit" element={<CoachFormPage />} />

          <Route path="/membership-types" element={<MembershipTypesPage />} />
          <Route path="/membership-types/new" element={<MembershipTypeFormPage />} />
          <Route path="/membership-types/:typeId/edit" element={<MembershipTypeFormPage />} />

          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/memberships/new" element={<MembershipFormPage />} />
          <Route path="/memberships/:membershipId" element={<MembershipDetailPage />} />
          <Route path="/memberships/:membershipId/edit" element={<MembershipFormPage />} />

          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payments/new" element={<PaymentFormPage />} />
          <Route path="/payments/:paymentId" element={<PaymentDetailPage />} />
          <Route path="/payments/:paymentId/edit" element={<PaymentFormPage />} />

          <Route path="/sports" element={<SportsPage />} />
          <Route path="/sports/new" element={<SportFormPage />} />
          <Route path="/sports/:sportId/edit" element={<SportFormPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/teams/:teamId/roster/new" element={<TeamRosterFormPage />} />

          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/facilities/new" element={<FacilityFormPage />} />
          <Route path="/facilities/:facilityId" element={<FacilityDetailPage />} />
          <Route path="/facilities/:facilityId/edit" element={<FacilityFormPage />} />

          <Route path="/facility-bookings" element={<FacilityBookingsPage />} />
          <Route path="/facility-bookings/new" element={<FacilityBookingFormPage />} />
          <Route path="/facility-bookings/:bookingId" element={<FacilityBookingDetailPage />} />
          <Route path="/facility-bookings/:bookingId/edit" element={<FacilityBookingFormPage />} />

          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/competitions/:competitionId" element={<CompetitionDetailPage />} />
          <Route path="/competitions/:competitionId/register/new" element={<TeamCompetitionFormPage />} />

          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
