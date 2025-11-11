import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function useBookedDates(farmhouseId) {
  const [bookedDates, setBookedDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBookedDates = useCallback(async () => {
    if (!farmhouseId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/booked-dates/${farmhouseId}`, {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        setBookedDates(result.data.booked_dates || [])
      } else {
        throw new Error(result.message || 'Failed to fetch booked dates')
      }
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load booked dates')
    } finally {
      setLoading(false)
    }
  }, [farmhouseId])

  const addBookedDate = async (dateString) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booked-dates/${farmhouseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ date: dateString }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Date marked as booked')
        await fetchBookedDates()
        return true
      } else {
        throw new Error(result.message || 'Failed to add booked date')
      }
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  const removeBookedDate = async (dateString) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booked-dates/${farmhouseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ date: dateString }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Date unmarked')
        await fetchBookedDates()
        return true
      } else {
        throw new Error(result.message || 'Failed to remove booked date')
      }
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  useEffect(() => {
    fetchBookedDates()
  }, [fetchBookedDates])

  return {
    bookedDates,
    loading,
    error,
    addBookedDate,
    removeBookedDate,
    refetchBookedDates: fetchBookedDates,
  }
}

export default useBookedDates
