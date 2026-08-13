import apiClient, { USE_MOCKS } from './client'
import { mockAthletes } from '../mocks/mockData'

export async function getAthletes() {
  if (USE_MOCKS) {
    return mockAthletes
  }
  const response = await apiClient.get('/athletes')
  return response.data
}

export async function getAthleteById(athleteId) {
  if (USE_MOCKS) {
    return mockAthletes.find((athlete) => athlete.athleteId === Number(athleteId))
  }
  const response = await apiClient.get(`/athletes/${athleteId}`)
  return response.data
}

export async function createAthlete(athlete) {
  const response = await apiClient.post('/athletes', athlete)
  return response.data
}

export async function updateAthlete(athleteId, athlete) {
  const response = await apiClient.put(`/athletes/${athleteId}`, athlete)
  return response.data
}

export async function deleteAthlete(athleteId) {
  await apiClient.delete(`/athletes/${athleteId}`)
}
