import { useState, useEffect } from 'react'
import { toast } from 'sonner'

// localStorage keys for AI suggestions persistence
const AI_SUGGESTIONS_KEY = 'aiSuggestions'
const AI_QUERY_KEY = 'aiQuery'
const AI_TIMESTAMP_KEY = 'aiTimestamp'

// Cache duration: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load cached suggestions on mount
  useEffect(() => {
    loadCachedSuggestions()
  }, [])

  const loadCachedSuggestions = () => {
    try {
      const cachedSuggestions = localStorage.getItem(AI_SUGGESTIONS_KEY)
      const cachedQuery = localStorage.getItem(AI_QUERY_KEY)
      const timestamp = localStorage.getItem(AI_TIMESTAMP_KEY)
      
      if (cachedSuggestions && timestamp && cachedQuery) {
        const now = Date.now()
        const cacheAge = now - parseInt(timestamp)
        
        // Only load if cache is still valid (within 30 minutes)
        if (cacheAge < CACHE_DURATION) {
          const parsedSuggestions = JSON.parse(cachedSuggestions)
          setSuggestions(parsedSuggestions)
          console.log('Loaded cached AI suggestions:', parsedSuggestions.length, 'properties')
        } else {
          // Clear expired cache
          clearCache()
        }
      }
    } catch (error) {
      console.error('Error loading cached AI suggestions:', error)
      clearCache()
    }
  }

  const saveSuggestionsToCache = (suggestions, query) => {
    try {
      localStorage.setItem(AI_SUGGESTIONS_KEY, JSON.stringify(suggestions))
      localStorage.setItem(AI_QUERY_KEY, query)
      localStorage.setItem(AI_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error('Error saving AI suggestions to cache:', error)
    }
  }

  const clearCache = () => {
    localStorage.removeItem(AI_SUGGESTIONS_KEY)
    localStorage.removeItem(AI_QUERY_KEY)
    localStorage.removeItem(AI_TIMESTAMP_KEY)
  }

  const getCachedQuery = () => {
    try {
      const timestamp = localStorage.getItem(AI_TIMESTAMP_KEY)
      if (timestamp) {
        const now = Date.now()
        const cacheAge = now - parseInt(timestamp)
        
        if (cacheAge < CACHE_DURATION) {
          return localStorage.getItem(AI_QUERY_KEY) || ''
        }
      }
    } catch (error) {
      console.error('Error getting cached query:', error)
    }
    return ''
  }

  const fetchSuggestions = async (userQuery, propertyType) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery || '',
          propertyType: propertyType || 'both'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const newSuggestions = data.properties || []
        setSuggestions(newSuggestions)
        // Save to cache for persistence
        saveSuggestionsToCache(newSuggestions, userQuery)
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
    clearCache()
  }

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    clearSuggestions,
    getCachedQuery,
    hasCachedSuggestions: suggestions.length > 0
  }
}
