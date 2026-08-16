import apiClient from './client'

export async function getPayments() {
  const response = await apiClient.get('/payments')
  return response.data
}

export async function getPaymentById(paymentId) {
  const response = await apiClient.get(`/payments/${paymentId}`)
  return response.data
}

export async function createPayment(payment) {
  const response = await apiClient.post('/payments', payment)
  return response.data
}

export async function updatePayment(paymentId, payment) {
  const response = await apiClient.put(`/payments/${paymentId}`, payment)
  return response.data
}

export async function deletePayment(paymentId) {
  await apiClient.delete(`/payments/${paymentId}`)
}
