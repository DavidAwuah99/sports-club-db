import apiClient from './client'

export async function getMembershipTypes() {
  const response = await apiClient.get('/membership-types')
  return response.data
}

export async function getMembershipTypeById(typeId) {
  const response = await apiClient.get(`/membership-types/${typeId}`)
  return response.data
}

export async function createMembershipType(membershipType) {
  const response = await apiClient.post('/membership-types', membershipType)
  return response.data
}

export async function updateMembershipType(typeId, membershipType) {
  const response = await apiClient.put(`/membership-types/${typeId}`, membershipType)
  return response.data
}

export async function deleteMembershipType(typeId) {
  await apiClient.delete(`/membership-types/${typeId}`)
}
