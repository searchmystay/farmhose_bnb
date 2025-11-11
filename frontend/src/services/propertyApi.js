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
      requestData.address = searchCriteria.address
      requestData.numberOfAdults = searchCriteria.numberOfAdults
      requestData.numberOfChildren = searchCriteria.numberOfChildren
      requestData.numberOfPets = searchCriteria.numberOfPets
      requestData.searchLatitude = searchCriteria.searchLatitude
      requestData.searchLongitude = searchCriteria.searchLongitude
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
      requestData.address = searchCriteria.address
      requestData.numberOfAdults = searchCriteria.numberOfAdults
      requestData.numberOfChildren = searchCriteria.numberOfChildren
      requestData.numberOfPets = searchCriteria.numberOfPets
      requestData.searchLatitude = searchCriteria.searchLatitude
      requestData.searchLongitude = searchCriteria.searchLongitude
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
      requestData.address = searchCriteria.address
      requestData.numberOfAdults = searchCriteria.numberOfAdults
      requestData.numberOfChildren = searchCriteria.numberOfChildren
      requestData.numberOfPets = searchCriteria.numberOfPets
      requestData.searchLatitude = searchCriteria.searchLatitude
      requestData.searchLongitude = searchCriteria.searchLongitude
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
    requestData.address = searchCriteria.address
    requestData.numberOfAdults = searchCriteria.numberOfAdults
    requestData.numberOfChildren = searchCriteria.numberOfChildren
    requestData.numberOfPets = searchCriteria.numberOfPets
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

export const saveBasicInfo = async (basicInfo, propertyId = null) => {
  try {
    const requestData = { ...basicInfo }
    if (propertyId) {
      requestData.propertyId = propertyId
    }
    const response = await apiClient.post('/save-basic-info', requestData)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to save basic information')
    }
    throw new Error('Failed to save basic information, Network error')
  }
}

export const verifyOtp = async (propertyId, otpCode) => {
  try {
    const response = await apiClient.post('/verify-otp', {
      propertyId,
      otpCode
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to verify OTP')
    }
    throw new Error('Failed to verify OTP, Network error')
  }
}

export const saveEssentialAmenities = async (propertyId, essentialAmenities) => {
  try {
    const response = await apiClient.post('/save-essential-amenities', {
      propertyId,
      essential_amenities: essentialAmenities
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to save essential amenities')
    }
    throw new Error('Failed to save essential amenities, Network error')
  }
}

export const saveExperienceAmenities = async (propertyId, experienceAmenities) => {
  try {
    const response = await apiClient.post('/save-experience-amenities', {
      propertyId,
      experience_amenities: experienceAmenities
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to save experience amenities')
    }
    throw new Error('Failed to save experience amenities, Network error')
  }
}

export const saveAdditionalAmenities = async (propertyId, additionalAmenities) => {
  try {
    const response = await apiClient.post('/save-additional-amenities', {
      propertyId,
      additional_amenities: additionalAmenities
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to save additional amenities')
    }
    throw new Error('Failed to save additional amenities, Network error')
  }
}

export const saveOwnerDetails = async (propertyId, ownerName, ownerDescription, dashboardId, dashboardPassword) => {
  try {
    const response = await apiClient.post('/save-owner-details', {
      propertyId,
      owner_name: ownerName,
      owner_description: ownerDescription,
      owner_dashboard_id: dashboardId,
      owner_dashboard_password: dashboardPassword
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to save owner details')
    }
    throw new Error('Failed to save owner details, Network error')
  }
}

export const uploadOwnerPhoto = async (propertyId, ownerPhoto) => {
  try {
    const formData = new FormData()
    formData.append('propertyId', propertyId)
    formData.append('ownerPhoto', ownerPhoto)
    
    const response = await apiClient.post('/upload-owner-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to upload owner photo')
    }
    throw new Error('Failed to upload owner photo, Network error')
  }
}

export const completePropertyRegistration = async (propertyId, propertyImages, propertyDocuments, aadhaarCard, panCard) => {
  try {
    const formData = new FormData()
    formData.append('propertyId', propertyId)
    
    propertyImages.forEach((image) => {
      formData.append('propertyImages', image)
    })
    
    propertyDocuments.forEach((doc) => {
      formData.append('propertyDocuments', doc)
    })
    
    formData.append('aadhaarCard', aadhaarCard)
    formData.append('panCard', panCard)
    
    const response = await apiClient.post('/complete-property-registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to complete registration')
    }
    throw new Error('Failed to complete registration, Network error')
  }
}