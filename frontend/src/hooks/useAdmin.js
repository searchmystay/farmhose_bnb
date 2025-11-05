import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { adminLogin, fetchPendingReviews, acceptReview, rejectReview, fetchPendingProperties, approveProperty, rejectProperty, fetchAdminPropertyDetails } from '../services/adminApi'

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (password) => {
    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await adminLogin({ password })
      if (result.success) {
        toast.success('Login successful')
        navigate('/admin')
      }
      return result
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {login, isLoading}
}

export const usePendingReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchPendingReviews()
      if (result.success && result.backend_data?.pending_reviews) {
        setPendingReviews(result.backend_data.pending_reviews)
      } else {
        setPendingReviews([])
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch pending reviews')
      toast.error(error.message || 'Failed to fetch pending reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptReview = async (reviewId) => {
    setActionLoading(reviewId)
    try {
      const result = await acceptReview(reviewId)
      if (result.success) {
        toast.success(result.message || 'Review accepted successfully')
        setPendingReviews(prevReviews => 
          prevReviews.filter(review => review.review_id !== reviewId)
        )
      }
    } catch (error) {
      toast.error(error.message || 'Failed to accept review')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectReview = async (reviewId) => {
    setActionLoading(reviewId)
    try {
      const result = await rejectReview(reviewId)
      if (result.success) {
        toast.success(result.message || 'Review rejected successfully')
        setPendingReviews(prevReviews => 
          prevReviews.filter(review => review.review_id !== reviewId)
        )
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject review')
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return {pendingReviews, isLoading, error, actionLoading,refetch: fetchReviews, handleAcceptReview, handleRejectReview}
}

export const usePendingProperties = () => {
  const [pendingProperties, setPendingProperties] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchProperties = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchPendingProperties()
      if (result.success && result.backend_data?.properties) {
        setPendingProperties(result.backend_data.properties)
      } else {
        setPendingProperties([])
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch pending properties')
      toast.error(error.message || 'Failed to fetch pending properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveProperty = async (propertyId) => {
    setActionLoading(propertyId)
    try {
      const result = await approveProperty(propertyId)
      if (result.success) {
        toast.success(result.message || 'Property approved successfully')
        setPendingProperties(prevProperties => 
          prevProperties.filter(property => property.id !== propertyId)
        )
      }
    } catch (error) {
      toast.error(error.message || 'Failed to approve property')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectProperty = async (propertyId) => {
    setActionLoading(propertyId)
    try {
      const result = await rejectProperty(propertyId)
      if (result.success) {
        toast.success(result.message || 'Property rejected successfully')
        setPendingProperties(prevProperties => 
          prevProperties.filter(property => property.id !== propertyId)
        )
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject property')
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {pendingProperties, isLoading, error, actionLoading, refetch: fetchProperties, handleApproveProperty, handleRejectProperty}
}

export const useAdminPropertyDetails = (propertyId) => {
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPropertyDetails = async () => {
    if (!propertyId) return
    
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchAdminPropertyDetails(propertyId)
      if (result.success && result.backend_data) {
        setPropertyDetails(result.backend_data)
      } else {
        setError('No property data found')
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch property details')
      toast.error(error.message || 'Failed to fetch property details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails()
    }
  }, [propertyId])

  return {propertyDetails, isLoading, error, refetch: fetchPropertyDetails}
}