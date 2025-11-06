import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useFarmhouseName, useReviewSubmission } from '../../hooks/usePropertyData'

function StarRating({ rating, setRating, readonly = false }) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && setRating(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`w-8 h-8 transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <svg
            className={`w-full h-full ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating} out of 5 stars
        </span>
      )}
    </div>
  )
}

function ReviewSubmissionPage() {
  const { farmhouseId } = useParams()
  const navigate = useNavigate()
  
  const { farmhouseName, loading: nameLoading, error: nameError } = useFarmhouseName(farmhouseId)
  const { handleSubmitReview, loading: submitLoading, error: submitError, success, resetState } = useReviewSubmission()
  
  const [formData, setFormData] = useState({
    reviewerName: '',
    rating: 0,
    description: ''
  })
  const [wordCount, setWordCount] = useState(0)

  const MIN_WORDS = 10
  const MAX_WORDS = 100

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const handleDescriptionChange = (e) => {
    const text = e.target.value
    const words = countWords(text)
    
    if (words <= MAX_WORDS) {
      setFormData(prev => ({ ...prev, description: text }))
      setWordCount(words)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.reviewerName.trim()) {
      alert('Please enter your name')
      return
    }
    
    if (formData.rating === 0) {
      alert('Please select a rating')
      return
    }
    
    if (!formData.description.trim()) {
      alert('Please write a review description')
      return
    }
    
    if (wordCount < MIN_WORDS) {
      alert(`Please write at least ${MIN_WORDS} words. Current: ${wordCount} words`)
      return
    }
    
    const result = await handleSubmitReview(
      farmhouseId,
      formData.reviewerName,
      formData.rating,
      formData.description
    )
    
    if (result.success) {
      toast.success('Review submitted successfully! Thank you for your feedback.')
      navigate('/')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your review has been submitted successfully.</p>
          <button
            onClick={() => resetState()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Share Your Experience
          </h1>
          {nameLoading ? (
            <div className="text-gray-600">
              <p className="text-lg font-medium">Loading farmhouse details...</p>
            </div>
          ) : farmhouseName ? (
            <div className="text-gray-600">
              <p className="text-lg font-medium">{farmhouseName}</p>
            </div>
          ) : nameError ? (
            <div className="text-red-600">
              <p className="text-sm">Error loading farmhouse name</p>
            </div>
          ) : null}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reviewer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                maxLength={50}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Your Experience *
              </label>
              <StarRating 
                rating={formData.rating} 
                setRating={(rating) => setFormData(prev => ({ ...prev, rating }))} 
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write Your Review * <span className="text-xs text-gray-500">(minimum 10 words)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Share your experience about the farmhouse, amenities, hospitality, and overall stay..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${
                  wordCount < MIN_WORDS ? 'text-red-600' : wordCount > MAX_WORDS * 0.9 ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {wordCount}/{MAX_WORDS} words {wordCount < MIN_WORDS && `(minimum ${MIN_WORDS} required)`}
                </span>
                <span className="text-xs text-gray-400">
                  Be specific about what you liked or could be improved
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitLoading || !formData.reviewerName.trim() || formData.rating === 0 || !formData.description.trim()}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Review...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>

          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                {submitError}
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Your review helps other travelers</p>
              <p>Share your honest experience to help future guests make informed decisions about their stay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewSubmissionPage