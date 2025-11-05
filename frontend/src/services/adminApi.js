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
    const response = await adminApiClient.post('/admin_login', loginData)
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

export const fetchAllProperties = async () => {
  try {
    const response = await adminApiClient.get('/admin_all_properties')
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch all properties')
    }
    throw new Error('Failed to fetch all properties, Network error')
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

export const fetchAdminPropertyDetails = async (propertyId) => {
  try {
    const response = await adminApiClient.get(`/admin_property/${propertyId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch admin property details')
    }
    throw new Error('Failed to fetch admin property details, Network error')
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

export const fetchPendingReviews = async () => {
  try {
    const response = await adminApiClient.get('/pending_reviews')
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch pending reviews')
    }
    throw new Error('Failed to fetch pending reviews, Network error')
  }
}

export const acceptReview = async (reviewId) => {
  try {
    const response = await adminApiClient.post(`/accept_comment/${reviewId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to accept review')
    }
    throw new Error('Failed to accept review, Network error')
  }
}

export const rejectReview = async (reviewId) => {
  try {
    const response = await adminApiClient.delete(`/reject_comment/${reviewId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to reject review')
    }
    throw new Error('Failed to reject review, Network error')
  }
}

export const checkAuthStatus = async () => {
  try {
    const response = await adminApiClient.get('/auto_login')
    return response.data
  } catch (error) {
    throw error.response?.data || { status: 'error', message: 'Failed to check auth status' }
  }
}

export const fetchAnalytics = async () => {
  try {
    const response = await adminApiClient.get('/analytics')
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch analytics')
    }
    throw new Error('Failed to fetch analytics, Network error')
  }
}