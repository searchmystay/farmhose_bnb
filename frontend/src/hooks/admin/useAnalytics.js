import { useState, useEffect } from 'react'
import { fetchAnalytics } from '../../services/adminApi'

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAnalytics()
      
      if (response.success) {
        setAnalytics(response.backend_data)
      } else {
        throw new Error('Failed to fetch analytics')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return { analytics, loading, error, refetch: loadAnalytics }
}
