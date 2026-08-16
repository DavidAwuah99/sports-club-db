import apiClient from './client'

export async function getActiveMembersReport() {
  const response = await apiClient.get('/reports/active-members')
  return response.data
}

export async function getOutstandingPaymentsReport() {
  const response = await apiClient.get('/reports/outstanding-payments')
  return response.data
}

export async function getUpcomingBookingsReport() {
  const response = await apiClient.get('/reports/upcoming-bookings')
  return response.data
}
