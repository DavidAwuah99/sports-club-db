import axios from 'axios'

export const USE_MOCKS = true

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
})

export default apiClient
