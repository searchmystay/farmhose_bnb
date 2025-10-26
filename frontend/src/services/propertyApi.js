import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
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

export const fetchTopProperties = async () => {
  const response = await apiClient.get('/top-properties')
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch top properties')
  }
  
  return result
}

export const fetchPropertyDetail = async (propertyId) => {
  const response = await apiClient.get(`/property-detail/${propertyId}`)
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch property details')
  }
  
  return result
}

export const registerProperty = async (formData) => {
  const response = await apiClient.post('/register-property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to register property')
  }
  
  return result
}

export const contactViaWhatsapp = async (propertyId) => {
  const response = await apiClient.post(`/contact-whatsapp/${propertyId}`)
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to get WhatsApp contact')
  }
  
  return result
}