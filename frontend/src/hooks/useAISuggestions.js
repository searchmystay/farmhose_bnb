import { useState } from 'react'
import { toast } from 'sonner'

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSuggestions = async (userQuery, propertyType) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ai_suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userQuery || '',
          propertyType: propertyType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSuggestions(data.suggestions || [])
      } else {
        setError('Failed to get suggestions')
        setSuggestions([])
      }
    } catch (err) {
      setError('Unable to fetch suggestions')
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const clearSuggestions = () => {
    setSuggestions([])
    setError(null)
  }

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    clearSuggestions
  }
}
