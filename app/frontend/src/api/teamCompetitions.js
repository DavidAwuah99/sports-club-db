import apiClient from './client'

export async function getTeamCompetitions() {
  const response = await apiClient.get('/team-competitions')
  return response.data
}

export async function createTeamCompetition(entry) {
  const response = await apiClient.post('/team-competitions', entry)
  return response.data
}
