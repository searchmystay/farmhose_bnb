import { useState, useEffect } from 'react'
import { fetchFarmhouseList, fetchBnbList } from '../services/propertyApi'

export const useFarmhouseList = () => {
  const [farmhouses, setFarmhouses] = useState([])
  const [loading, setLoading] = useState(true)
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
    loadFarmhouses()
  }, [])

  return { farmhouses, loading, error, refetch: loadFarmhouses }
}

export const useBnbList = () => {
  const [bnbs, setBnbs] = useState([])
  const [loading, setLoading] = useState(true)
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
    loadBnbs()
  }, [])

  return { bnbs, loading, error, refetch: loadBnbs }
}