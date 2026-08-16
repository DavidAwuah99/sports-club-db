import apiClient from './client'

export async function getMemberships() {
  const response = await apiClient.get('/memberships')
  return response.data
}

export async function getMembershipById(membershipId) {
  const response = await apiClient.get(`/memberships/${membershipId}`)
  return response.data
}

export async function createMembership(membership) {
  const response = await apiClient.post('/memberships', membership)
  return response.data
}

export async function updateMembership(membershipId, membership) {
  const response = await apiClient.put(`/memberships/${membershipId}`, membership)
  return response.data
}

export async function deleteMembership(membershipId) {
  await apiClient.delete(`/memberships/${membershipId}`)
}
