import apiClient, { USE_MOCKS } from './client'
import { mockAthletes } from '../mocks/mockData'

export async function getAthletes({ lastName, membershipStatus } = {}) {
  if (USE_MOCKS) {
    return mockAthletes
  }
  const params = {}
  if (lastName) params.lastName = lastName
  if (membershipStatus) params.membershipStatus = membershipStatus
  const response = await apiClient.get('/athletes', { params })
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

export async function registerAthleteWithMembership(payload) {
  const response = await apiClient.post('/athletes/register', payload)
  return response.data
}
