import { usePendingReviews } from '../../hooks/useAdmin'

function PendingReviewsPage() {
  const { pendingReviews, isLoading, error, actionLoading, refetch, handleAcceptReview, handleRejectReview } = usePendingReviews()

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <span className="text-gray-600 text-sm sm:text-base">Loading pending reviews...</span>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
        <button onClick={refetch} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
          Try Again
        </button>
      </div>
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-600 text-base sm:text-lg">No pending reviews</p>
        <p className="text-gray-500 text-sm sm:text-base mt-2">All reviews have been processed</p>
      </div>
    </div>
  )

  const renderReviewerInfo = (review) => (
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="font-medium">Reviewed by: </span>
      <span className="ml-1 text-gray-900 font-medium">{review.reviewer_name || review.user_name || 'Anonymous'}</span>
    </div>
  )

  const renderStarRating = (rating) => (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-2">Rating:</span>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">({rating}/5)</span>
      </div>
    </div>
  )

  const renderActionButtons = (reviewId) => {
    const isAcceptLoading = actionLoading === reviewId
    const isRejectLoading = actionLoading === reviewId
    
    return (
      <div className="flex gap-3">
        <button 
          onClick={() => handleAcceptReview(reviewId)} 
          disabled={actionLoading === reviewId}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
        >
          {isAcceptLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isAcceptLoading ? 'Accepting...' : 'Accept'}
        </button>
        <button 
          onClick={() => handleRejectReview(reviewId)} 
          disabled={actionLoading === reviewId}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
        >
          {isRejectLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {isRejectLoading ? 'Rejecting...' : 'Reject'}
        </button>
      </div>
    )
  }

  const renderReviewComment = (review) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Review Comment:
      </h5>
      <p className="text-gray-700 text-sm leading-relaxed">
        {review.review_comment || 'No comment provided'}
      </p>
    </div>
  )

  const renderTimestamp = (review) => {
    if (!review.created_at && !review.submitted_at) return null
    return (
      <div className="mt-4 flex items-center text-xs text-gray-500">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Submitted on: {new Date(review.created_at || review.submitted_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    )
  }

  const renderReviewCard = (review) => (
    <div key={review.id || review.review_id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900">
          {review.farmhouse_name || review.property_name || 'Unknown Farmhouse'}
        </h4>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            {renderReviewerInfo(review)}
            {review.rating && renderStarRating(review.rating)}
          </div>
          {renderActionButtons(review.id || review.review_id)}
        </div>
        {renderReviewComment(review)}
        {renderTimestamp(review)}
      </div>
    </div>
  )

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (pendingReviews.length === 0) return renderEmptyState()

  return (
    <div className="grid gap-6">
      {pendingReviews.map(renderReviewCard)}
    </div>
  )
}

export default PendingReviewsPage