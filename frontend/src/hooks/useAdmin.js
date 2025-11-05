import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { adminLogin, fetchPendingReviews } from '../services/adminApi'

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
      navigate('/admin/dashboard')
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

  useEffect(() => {
    fetchReviews()
  }, [])

  return {pendingReviews, isLoading, error, refetch: fetchReviews}
}