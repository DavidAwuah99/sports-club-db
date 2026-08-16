import apiClient from './client'

export async function getTeamRosters() {
  const response = await apiClient.get('/team-rosters')
  return response.data
}

export async function createTeamRoster(entry) {
  const response = await apiClient.post('/team-rosters', entry)
  return response.data
}
