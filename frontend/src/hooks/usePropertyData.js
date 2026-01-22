import { useState, useEffect } from 'react'
import { fetchFarmhouseList, fetchBnbList, fetchPropertyList, fetchTopProperties, fetchPropertyDetail, registerProperty, contactViaWhatsapp, toggleWishlist, createLead, getUserWishlist, submitReview, getFarmhouseName } from '../services/propertyApi'

export const useFarmhouseList = (shouldFetch = false) => {
  const [farmhouses, setFarmhouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      return searchCriteria ? JSON.parse(searchCriteria) : null
    } catch (err) {
      return null
    }
  }

  const loadFarmhouses = async () => {
    try {
      setLoading(true)
      setError(null)
      const searchCriteria = getSearchCriteria()
      const response = await fetchFarmhouseList(searchCriteria)
      const farmhouseData = response.backend_data || []
      setFarmhouses(farmhouseData)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch farmhouses'
      setError(errorMessage)
      setFarmhouses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      loadFarmhouses()
    }
  }, [shouldFetch])

  return { farmhouses, loading, error, refetch: loadFarmhouses }
}

export const useBnbList = (shouldFetch = false) => {
  const [bnbs, setBnbs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      return searchCriteria ? JSON.parse(searchCriteria) : null
    } catch (err) {
      return null
    }
  }

  const loadBnbs = async () => {
    try {
      setLoading(true)
      setError(null)
      const searchCriteria = getSearchCriteria()
      const response = await fetchBnbList(searchCriteria)
      const bnbData = response.backend_data || []
      setBnbs(bnbData)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch BnBs'
      setError(errorMessage)
      setBnbs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      loadBnbs()
    }
  }, [shouldFetch])

  return { bnbs, loading, error, refetch: loadBnbs }
}

export const usePropertyList = (shouldFetch = false) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      return searchCriteria ? JSON.parse(searchCriteria) : null
    } catch (err) {
      return null
    }
  }

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const searchCriteria = getSearchCriteria()
      const response = await fetchPropertyList(searchCriteria)
      const propertyData = response.backend_data || []
      setProperties(propertyData)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch properties'
      setError(errorMessage)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      loadProperties()
    }
  }, [shouldFetch])

  return { properties, loading, error, refetch: loadProperties }
}

export const useTopProperties = () => {
  const [topFarmhouses, setTopFarmhouses] = useState([])
  const [topBnbs, setTopBnbs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadTopProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchTopProperties()
      const data = response.backend_data || {}
      setTopFarmhouses(data.top_farmhouse || [])
      setTopBnbs(data.top_bnb || [])
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch top properties'
      setError(errorMessage)
      setTopFarmhouses([])
      setTopBnbs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopProperties()
  }, [])

  return { topFarmhouses, topBnbs, loading, error, refetch: loadTopProperties }
}

export const usePropertyRegistration = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const submitRegistration = async (registrationData) => {
    try {
      setLoading(true)
      setSuccess(false)

      const formData = new FormData()
      
      formData.append('name', registrationData.basicInfo.name)
      formData.append('description', registrationData.basicInfo.description)
      formData.append('type', registrationData.basicInfo.type)
      formData.append('per_day_price', registrationData.basicInfo.per_day_price)
      formData.append('max_people_allowed', registrationData.basicInfo.max_people_allowed)
      formData.append('opening_time', registrationData.basicInfo.opening_time)
      formData.append('closing_time', registrationData.basicInfo.closing_time)
      formData.append('phone_number', registrationData.basicInfo.phone_number)
      formData.append('address', registrationData.basicInfo.address)
      formData.append('pin_code', registrationData.basicInfo.pin_code)
      formData.append('essentialAmenities', JSON.stringify(registrationData.essentialAmenities))
      formData.append('experienceAmenities', JSON.stringify(registrationData.experienceAmenities))
      formData.append('additionalAmenities', JSON.stringify(registrationData.additionalAmenities))
      
      formData.append('owner_name', registrationData.ownerDetails.ownerName)
      formData.append('owner_description', registrationData.ownerDetails.ownerDescription)
      if (registrationData.ownerDetails.ownerPhoto) {
        formData.append('owner_photo', registrationData.ownerDetails.ownerPhoto)
      }
      
      if (registrationData.uploadData.propertyImages?.length > 0) {
        registrationData.uploadData.propertyImages.forEach((file, index) => {
          formData.append(`propertyImages`, file)
        })
      }
      
      if (registrationData.uploadData.propertyDocuments?.length > 0) {
        registrationData.uploadData.propertyDocuments.forEach((file, index) => {
          formData.append(`propertyDocuments`, file)
        })
      }
      
      if (registrationData.uploadData.aadhaarCard) {
        formData.append('aadhaarCard', registrationData.uploadData.aadhaarCard)
      }
      
      if (registrationData.uploadData.panCard) {
        formData.append('panCard', registrationData.uploadData.panCard)
      }

      const result = await registerProperty(formData)
      setSuccess(true)
      return result
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to register property'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setLoading(false)
    setSuccess(false)
  }

  return { 
    submitRegistration, 
    loading,
    success,
    resetState
  }
}

export const usePropertyDetail = (propertyId) => {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLeadEmail = () => {
    try {
      const leadData = sessionStorage.getItem('leadInfo')
      const parsedData = leadData ? JSON.parse(leadData) : null
      return parsedData?.email || null
    } catch (err) {
      return null
    }
  }

  const getSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      return searchCriteria ? JSON.parse(searchCriteria) : null
    } catch (err) {
      return null
    }
  }

  const loadPropertyDetail = async () => {
    if (!propertyId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const leadEmail = getLeadEmail()
      const searchCriteria = getSearchCriteria()
      const response = await fetchPropertyDetail(propertyId, leadEmail, searchCriteria)
      setProperty(response.backend_data)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch property details'
      setError(errorMessage)
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPropertyDetail()
  }, [propertyId])

  return { property, loading, error, refetch: loadPropertyDetail }
}

export const useWhatsappContact = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getWhatsappLink = async (propertyId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await contactViaWhatsapp(propertyId)
      const whatsappLink = response.backend_data?.whatsapp_link
      
      if (whatsappLink) {
        window.location.href = whatsappLink
      }
      
      return response.backend_data
    } catch (err) {
      const errorMessage = err.message || 'Failed to get WhatsApp contact'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { getWhatsappLink, loading, error }
}

export const useLeadRegistration = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLeadInfo = async (leadData) => {
    try {
      setLoading(true)
      setError(null)

      const email = leadData.email || null
      const name = leadData.name || null
      const mobileNumber = leadData.mobile || null

      const result = await createLead(email, name, mobileNumber)
      
      const leadInfoToStore = {
        email: email,
        name: name,
        mobile: mobileNumber
      }
      
      sessionStorage.setItem('leadInfo', JSON.stringify(leadInfoToStore))
      
      setLoading(false)
      return { success: true, data: result }

    } catch (err) {
      const errorMessage = err.message || 'Failed to register lead'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const getLeadInfo = () => {
    try {
      const leadData = sessionStorage.getItem('leadInfo')
      const parsedData = leadData ? JSON.parse(leadData) : null
      return parsedData
    } catch (err) {
      return null
    }
  }

  return { handleLeadInfo, getLeadInfo, loading, error}
}

export const useToggleWishlist = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleToggleWishlist = async (email, farmhouseId) => {
    try {
      setLoading(true)
      setError(null)

      const result = await toggleWishlist(email, farmhouseId)
      
      setLoading(false)
      return { success: true, data: result }

    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle wishlist'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  return {handleToggleWishlist, loading, error}
}

export const useUserWishlist = () => {
  const [wishlistProperties, setWishlistProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLeadEmail = () => {
    try {
      const leadData = sessionStorage.getItem('leadInfo')
      const parsedData = leadData ? JSON.parse(leadData) : null
      return parsedData?.email || null
    } catch (err) {
      return null
    }
  }

  const loadWishlist = async () => {
    const email = getLeadEmail()
    if (!email) {
      setError('Please login to view your wishlist')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getUserWishlist(email)
      const properties = response.backend_data || []
      setWishlistProperties(properties)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch wishlist'
      setError(errorMessage)
      setWishlistProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  return { wishlistProperties, loading, error, refetch: loadWishlist, userEmail: getLeadEmail() }
}

export const useFarmhouseName = (farmhouseId) => {
  const [farmhouseName, setFarmhouseName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFarmhouseName = async () => {
    if (!farmhouseId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await getFarmhouseName(farmhouseId)
      const name = response.backend_data.farmhouse_name || ''
      setFarmhouseName(name)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch farmhouse name'
      setError(errorMessage)
      setFarmhouseName('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFarmhouseName()
  }, [farmhouseId])

  return { farmhouseName, loading, error, refetch: loadFarmhouseName }
}

export const useSearchCriteria = () => {
  const [hasSearchCriteria, setHasSearchCriteria] = useState(false)

  const checkSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      const hasValidCriteria = searchCriteria && searchCriteria !== 'null' && searchCriteria !== 'undefined'
      setHasSearchCriteria(hasValidCriteria)
      return hasValidCriteria
    } catch (err) {
      setHasSearchCriteria(false)
      return false
    }
  }

  const getSearchCriteria = () => {
    try {
      const searchCriteria = sessionStorage.getItem('searchCriteria')
      return searchCriteria ? JSON.parse(searchCriteria) : null
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    checkSearchCriteria()
  }, [])

  return { hasSearchCriteria, checkSearchCriteria, getSearchCriteria }
}

export const useReviewSubmission = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmitReview = async (farmhouseId, reviewerName, rating, reviewComment) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await submitReview(farmhouseId, reviewerName, rating, reviewComment)
      setSuccess(true)
      return { success: true, data: result }

    } catch (err) {
      const errorMessage = err.message || 'Failed to submit review'
      setError(errorMessage)
      setSuccess(false)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }

  return { handleSubmitReview, loading, error, success, resetState }
}