import { usePendingProperties } from '../../hooks/useAdmin'

function PendingPropertiesPage({ onViewDetails }) {
  const { pendingProperties, isLoading, error, actionLoading, refetch, handleApproveProperty, handleRejectProperty } = usePendingProperties()

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <span className="text-gray-600 text-sm sm:text-base">Loading pending properties...</span>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-gray-600 text-base sm:text-lg">No pending properties</p>
        <p className="text-gray-500 text-sm sm:text-base mt-2">All properties have been processed</p>
      </div>
    </div>
  )

  const handleApproveClick = (propertyId) => {
    console.log('Approve clicked for property:', propertyId)
    handleApproveProperty(propertyId)
  }

  const handleRejectClick = (propertyId) => {
    console.log('Reject clicked for property:', propertyId)
    handleRejectProperty(propertyId)
  }

  const renderPropertyRow = (property) => (
    <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-1">Property Name</div>
          <button
            onClick={() => onViewDetails && onViewDetails(property.id)}
            className="font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base block truncate text-left transition-colors"
          >
            {property.name || 'Unknown Property'}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-1">Type</div>
          <span className="text-gray-600 text-sm block truncate">{property.type || 'Not specified'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-1">Phone Number</div>
          <span className="text-gray-600 text-sm block truncate">{property.phone_number || 'Not provided'}</span>
        </div>
        <div className="flex gap-2 md:gap-3 flex-shrink-0 w-full md:w-auto">
          <button 
            onClick={() => handleApproveClick(property.id)} 
            disabled={actionLoading === property.id}
            className="bg-green-600 text-white px-3 py-2 md:px-6 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-1 md:gap-2 flex-1 md:flex-none"
          >
            {actionLoading === property.id ? (
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="hidden md:inline">{actionLoading === property.id ? 'Approving...' : 'Approve'}</span>
            <span className="md:hidden">✓</span>
          </button>
          <button 
            onClick={() => handleRejectClick(property.id)} 
            disabled={actionLoading === property.id}
            className="bg-red-600 text-white px-3 py-2 md:px-6 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-1 md:gap-2 flex-1 md:flex-none"
          >
            {actionLoading === property.id ? (
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="hidden md:inline">{actionLoading === property.id ? 'Rejecting...' : 'Reject'}</span>
            <span className="md:hidden">✕</span>
          </button>
        </div>
      </div>
    </div>
  )

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (pendingProperties.length === 0) return renderEmptyState()

  return (
    <div className="grid gap-4">
      {pendingProperties.map(renderPropertyRow)}
    </div>
  )
}

export default PendingPropertiesPage