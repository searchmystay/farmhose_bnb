import { useState, useEffect } from 'react'
import { fetchOwnerDashboardData } from '../../services/ownerService'

const useOwnerDashboard = (farmhouseId) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    if (!farmhouseId) {
      setError('Farmhouse ID is required')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await fetchOwnerDashboardData(farmhouseId)
      const data = result.backend_data
      setDashboardData(data)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [farmhouseId])

  const refetchData = () => {
    loadDashboardData()
  }

  return {
    dashboardData,
    loading,
    error,
    refetchData,
  }
}

export default useOwnerDashboard
