import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchFarmhouseList = async () => {
  const response = await apiClient.get('/farmhouse-list')
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch farmhouses')
  }
  
  return result
}

export const fetchBnbList = async () => {
  const response = await apiClient.get('/bnb-list')
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch BnBs')
  }
  
  return result
}