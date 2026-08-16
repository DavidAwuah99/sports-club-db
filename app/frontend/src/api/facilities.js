import apiClient from './client'

export async function getFacilities() {
  const response = await apiClient.get('/facilities')
  return response.data
}

export async function getFacilityById(facilityId) {
  const response = await apiClient.get(`/facilities/${facilityId}`)
  return response.data
}

export async function createFacility(facility) {
  const response = await apiClient.post('/facilities', facility)
  return response.data
}

export async function updateFacility(facilityId, facility) {
  const response = await apiClient.put(`/facilities/${facilityId}`, facility)
  return response.data
}

export async function deleteFacility(facilityId) {
  await apiClient.delete(`/facilities/${facilityId}`)
}
