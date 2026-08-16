import apiClient from './client'

export async function getFacilityBookings() {
  const response = await apiClient.get('/facility-bookings')
  return response.data
}

export async function getFacilityBookingById(bookingId) {
  const response = await apiClient.get(`/facility-bookings/${bookingId}`)
  return response.data
}

export async function createFacilityBooking(booking) {
  const response = await apiClient.post('/facility-bookings', booking)
  return response.data
}

export async function updateFacilityBooking(bookingId, booking) {
  const response = await apiClient.put(`/facility-bookings/${bookingId}`, booking)
  return response.data
}

export async function deleteFacilityBooking(bookingId) {
  await apiClient.delete(`/facility-bookings/${bookingId}`)
}
