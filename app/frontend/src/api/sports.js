import apiClient from './client'

export async function getSports() {
  const response = await apiClient.get('/sports')
  return response.data
}

export async function getSportById(sportId) {
  const response = await apiClient.get(`/sports/${sportId}`)
  return response.data
}

export async function createSport(sport) {
  const response = await apiClient.post('/sports', sport)
  return response.data
}

export async function updateSport(sportId, sport) {
  const response = await apiClient.put(`/sports/${sportId}`, sport)
  return response.data
}

export async function deleteSport(sportId) {
  await apiClient.delete(`/sports/${sportId}`)
}
