import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const adminApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const adminLogin = async (loginData) => {
  try {
    const response = await adminApiClient.post('/super_admin_login', loginData)
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

export const fetchPendingProperties = async () => {
  try {
    const response = await adminApiClient.get('/pending_properties')
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch pending properties')
    }
    throw new Error('Failed to fetch pending properties, Network error')
  }
}

export const fetchPendingPropertyDetails = async (propertyId) => {
  try {
    const response = await adminApiClient.get(`/pending_property/${propertyId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch property details')
    }
    throw new Error('Failed to fetch property details, Network error')
  }
}

export const approveProperty = async (propertyId) => {
  try {
    const response = await adminApiClient.post(`/approve_property/${propertyId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to approve property')
    }
    throw new Error('Failed to approve property, Network error')
  }
}

export const rejectProperty = async (propertyId) => {
  try {
    const response = await adminApiClient.delete(`/reject_property/${propertyId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to reject property')
    }
    throw new Error('Failed to reject property, Network error')
  }
}

export const addCreditBalance = async (propertyId, creditAmount) => {
  try {
    const response = await adminApiClient.post(`/add_credit/${propertyId}`, { credit_amount: creditAmount })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to add credit balance')
    }
    throw new Error('Failed to add credit balance, Network error')
  }
}

export const markPropertyAsFavourite = async (propertyId, favouriteStatus) => {
  try {
    const response = await adminApiClient.post(`/mark_favourite/${propertyId}`, { favourite: favouriteStatus })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to update favourite status')
    }
    throw new Error('Failed to update favourite status, Network error')
  }
}