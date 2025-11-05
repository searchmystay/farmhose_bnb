import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ownerApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const ownerLogin = async (loginData) => {
  try {
    const response = await ownerApiClient.post('/owner-login', loginData)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to login')
    }
    throw new Error('Failed to login, Network error')
  }
}

export const ownerLogout = async () => {
  try {
    const response = await ownerApiClient.post('/owner-logout')
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to logout')
    }
    throw new Error('Failed to logout, Network error')
  }
}

export const checkOwnerAuthStatus = async () => {
  try {
    const response = await ownerApiClient.get('/owner-auto-login')
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Not authenticated')
    }
    throw new Error('Authentication check failed')
  }
}
