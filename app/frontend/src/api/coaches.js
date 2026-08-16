import apiClient from './client'

export async function getCoaches() {
  const response = await apiClient.get('/coaches')
  return response.data
}

export async function getCoachById(coachId) {
  const response = await apiClient.get(`/coaches/${coachId}`)
  return response.data
}

export async function createCoach(coach) {
  const response = await apiClient.post('/coaches', coach)
  return response.data
}

export async function updateCoach(coachId, coach) {
  const response = await apiClient.put(`/coaches/${coachId}`, coach)
  return response.data
}

export async function deleteCoach(coachId) {
  await apiClient.delete(`/coaches/${coachId}`)
}
