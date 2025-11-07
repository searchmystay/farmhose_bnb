import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchFarmhouseList = async (searchCriteria = null) => {
  try {
    const requestData = {}
    
    if (searchCriteria) {
      requestData.checkInDate = searchCriteria.checkInDate
      requestData.checkOutDate = searchCriteria.checkOutDate
      requestData.numberOfPeople = searchCriteria.numberOfPeople
    }
    
    const response = await apiClient.post('/farmhouse-list', requestData)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch farmhouses')
    }
    throw new Error('Failed to fetch farmhouses, Network error')
  }
}

export const fetchBnbList = async (searchCriteria = null) => {
  try {
    const requestData = {}
    
    if (searchCriteria) {
      requestData.checkInDate = searchCriteria.checkInDate
      requestData.checkOutDate = searchCriteria.checkOutDate
      requestData.numberOfPeople = searchCriteria.numberOfPeople
    }
    
    const response = await apiClient.post('/bnb-list', requestData)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch BnBs')
    }
    throw new Error('Failed to fetch BnBs, Network error')
  }
}

export const fetchPropertyList = async (searchCriteria = null) => {
  try {
    const requestData = {}
    
    if (searchCriteria) {
      requestData.checkInDate = searchCriteria.checkInDate
      requestData.checkOutDate = searchCriteria.checkOutDate
      requestData.numberOfPeople = searchCriteria.numberOfPeople
      requestData.propertyType = searchCriteria.propertyType
    }
    
    const response = await apiClient.post('/property-list', requestData)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch properties')
    }
    throw new Error('Failed to fetch properties, Network error')
  }
}

export const fetchTopProperties = async () => {
  const response = await apiClient.get('/top-properties')
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch top properties')
  }
  
  return result
}

export const fetchPropertyDetail = async (propertyId, leadEmail = null, searchCriteria = null) => {
  const requestData = {}
  
  if (leadEmail) {
    requestData.leadEmail = leadEmail
  }
  
  if (searchCriteria) {
    requestData.checkInDate = searchCriteria.checkInDate
    requestData.checkOutDate = searchCriteria.checkOutDate
    requestData.numberOfPeople = searchCriteria.numberOfPeople
  }
  
  const response = await apiClient.post(`/property-detail/${propertyId}`, requestData)
  const result = response.data
  
  if (result.success === false) {
    throw new Error(result.message || 'Failed to fetch property details')
  }
  
  return result
}

export const registerProperty = async (formData) => {
  try {
    const response = await apiClient.post('/register-property', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to register property')
    }
    throw new Error(error.message || 'Failed to register property, Network error')
  }
}

export const contactViaWhatsapp = async (propertyId) => {
  try {
    const response = await apiClient.post(`/contact-whatsapp/${propertyId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to get WhatsApp contact')
    }
    throw new Error('Failed to get WhatsApp contact, Network error')
  }
}

export const toggleWishlist = async (email, farmhouseId) => {
  try {
    const response = await apiClient.post('/toggle-wishlist', {
      email: email,
      farmhouse_id: farmhouseId
    })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to toggle wishlist')
    }
    throw new Error('Failed to toggle wishlist, Network error')
  }
}

export const createLead = async (email, name = null, mobileNumber = null) => {
  try {
    const requestData = { email }
    
    if (name) {
      requestData.name = name
    }
    
    if (mobileNumber) {
      requestData.mobile_number = mobileNumber
    }
    
    const response = await apiClient.post('/create-lead', requestData)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to create lead')
    }
    throw new Error('Failed to create lead, Network error')
  }
}

export const getUserWishlist = async (email) => {
  try {
    const response = await apiClient.post('/get-wishlist', {
      email: email
    })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch wishlist')
    }
    throw new Error('Failed to fetch wishlist, Network error')
  }
}

export const submitReview = async (farmhouseId, reviewerName, rating, reviewComment) => {
  try {
    const response = await apiClient.post('/submit-review', {
      farmhouse_id: farmhouseId,
      reviewer_name: reviewerName,
      rating: rating,
      review_comment: reviewComment
    })
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to submit review')
    }
    throw new Error('Failed to submit review, Network error')
  }
}

export const getFarmhouseName = async (farmhouseId) => {
  try {
    const response = await apiClient.get(`/farmhouse-name/${farmhouseId}`)
    const result = response.data
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      const backendError = error.response.data
      throw new Error(backendError.message || 'Failed to fetch farmhouse name')
    }
    throw new Error('Failed to fetch farmhouse name, Network error')
  }
}