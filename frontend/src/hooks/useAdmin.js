import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { adminLogin, fetchPendingReviews, acceptReview, rejectReview } from '../services/adminApi'

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