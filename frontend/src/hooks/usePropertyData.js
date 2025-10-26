import { useState, useEffect } from 'react'
import { fetchFarmhouseList, fetchBnbList, fetchTopProperties, fetchPropertyDetail, registerProperty, contactViaWhatsapp } from '../services/propertyApi'

export const useFarmhouseList = (shouldFetch = false) => {
  const [farmhouses, setFarmhouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFarmhouses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFarmhouseList()
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

  const loadBnbs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchBnbList()
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
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitRegistration = async (registrationData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const formData = new FormData()
      
      formData.append('name', registrationData.basicInfo.name)
      formData.append('description', registrationData.basicInfo.description)
      formData.append('type', registrationData.basicInfo.type)
      formData.append('phone_number', registrationData.basicInfo.phone_number)
      formData.append('address', registrationData.basicInfo.address)
      formData.append('pin_code', registrationData.basicInfo.pin_code)
      formData.append('essentialAmenities', JSON.stringify(registrationData.essentialAmenities))
      formData.append('experienceAmenities', JSON.stringify(registrationData.experienceAmenities))
      formData.append('additionalAmenities', JSON.stringify(registrationData.additionalAmenities))
      
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
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }

  return { 
    submitRegistration, 
    loading, 
    error, 
    success, 
    resetState 
  }
}

export const usePropertyDetail = (propertyId) => {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadPropertyDetail = async () => {
    if (!propertyId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await fetchPropertyDetail(propertyId)
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
        window.open(whatsappLink, '_blank')
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