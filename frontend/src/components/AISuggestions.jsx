import React, { useState, useEffect } from 'react'
import { useAISuggestions } from '../hooks/useAISuggestions'

const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm w-80 h-96 flex-shrink-0 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="flex justify-between items-center mt-auto pt-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
)

const SuggestionCard = ({ property, onClick }) => (
  <div 
    onClick={() => onClick?.(property._id)}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-96 flex-shrink-0 overflow-hidden cursor-pointer group flex flex-col w-full"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={property.image} 
        alt={property.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
        AI Pick ✨
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-medium text-lg mb-2 text-gray-900">{property.title}</h3>
      <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-grow line-clamp-2">{property.description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">Jaipur, Rajasthan</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-gray-600">{property.rating}</span>
        </div>
      </div>
    </div>
  </div>
)

const RecommendationHeader = ({ searchQuery }) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          ✨ AI Suggestions
        </h2>
        <p className="text-gray-600 text-lg">
          Discover your perfect property with intelligent recommendations
        </p>
      </div>
      
      {searchQuery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-medium">You searched for:</span> "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  )
}

const AISuggestions = ({ onPropertyClick, propertyType = 'both' }) => {
  const { suggestions, loading, error, fetchSuggestions } = useAISuggestions()
  const [userQuery, setUserQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const getVisibleCards = () => {
    if (typeof window === 'undefined') {
      return 1
    }
    if (window.innerWidth >= 1024) return 4
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [visibleCards, setVisibleCards] = useState(getVisibleCards)

  const countWords = (text) => {
    const matches = text.trim().match(/\b\S+\b/g)
    return matches ? matches.length : 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const wordCount = countWords(userQuery)
    if (userQuery.trim() && wordCount <= 100) {
      setSearchQuery(userQuery.trim())
      setHasSubmitted(true)
      fetchSuggestions(userQuery.trim(), propertyType)
    }
  }

  const renderInputForm = () => (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Tell us what you're looking for... (e.g., 'I want a luxury farmhouse in Jaipur for 10 guests with swimming pool, garden, and modern amenities for a weekend getaway')"
            rows={6}
            className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 text-base resize-none leading-relaxed placeholder-gray-400"
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            {countWords(userQuery)} words / 100 words max
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!userQuery.trim() || loading || countWords(userQuery) > 100}
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finding Properties...
              </div>
            ) : (
              'Get AI Suggestions'
            )}
          </button>
        </div>
      </form>
    </div>
  )

  const shouldEnableCarousel = suggestions.length > visibleCards
  const extendedSuggestions = shouldEnableCarousel ? [...suggestions, ...suggestions, ...suggestions] : suggestions
  const startIndex = shouldEnableCarousel ? suggestions.length : 0
  const cardWidthPercent = visibleCards > 0 ? 100 / visibleCards : 100

  useEffect(() => {
    if (!shouldEnableCarousel) {
      return undefined
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1)
    }, 4000)

    return () => clearInterval(interval)
  }, [shouldEnableCarousel])

  useEffect(() => {
    if (!shouldEnableCarousel) {
      return undefined
    }

    if (currentIndex < startIndex + suggestions.length) {
      return undefined
    }

    let enableTimeout
    const resetTimeout = setTimeout(() => {
      setIsTransitioning(false)
      setCurrentIndex(startIndex)
      enableTimeout = setTimeout(() => setIsTransitioning(true), 50)
    }, 700)

    return () => {
      clearTimeout(resetTimeout)
      if (enableTimeout) clearTimeout(enableTimeout)
    }
  }, [currentIndex, shouldEnableCarousel, startIndex, suggestions.length])

  useEffect(() => {
    if (shouldEnableCarousel) {
      setCurrentIndex(startIndex)
    } else {
      setCurrentIndex(0)
    }
  }, [shouldEnableCarousel, startIndex])

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderContent = () => {
    if (!hasSubmitted) {
      return null
    }

    if (loading) {
      return (
        <div className="overflow-hidden">
          <div className="flex gap-6">
            {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      )
    }

    if (error || suggestions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No suggestions found. Try a different query.</p>
        </div>
      )
    }

    return (
      <div>
        {shouldEnableCarousel ? (
          <>
            <div className="relative overflow-hidden">
              <div
                className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
                  width: `${extendedSuggestions.length * cardWidthPercent}%`
                }}
              >
                {extendedSuggestions.map((property, index) => (
                  <div
                    key={`${property._id || index}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `${cardWidthPercent}%` }}
                  >
                    <SuggestionCard
                      property={property}
                      onClick={onPropertyClick}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {suggestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(startIndex + index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    (currentIndex - startIndex) % suggestions.length === index
                      ? 'bg-gray-900 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={`grid gap-6 ${
            suggestions.length === 1
              ? 'max-w-md mx-auto'
              : suggestions.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {suggestions.map((property, index) => (
              <SuggestionCard
                key={`${property._id || index}`}
                property={property}
                onClick={onPropertyClick}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      <div className="container mx-auto px-4">
        <RecommendationHeader 
          searchQuery={searchQuery}
        />
        {!hasSubmitted && renderInputForm()}
        {renderContent()}
      </div>
    </section>
  )
}

export default AISuggestions
