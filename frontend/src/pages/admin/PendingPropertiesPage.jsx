import { usePendingProperties } from '../../hooks/useAdmin'

function PendingPropertiesPage() {
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

  const renderPropertyType = (property) => (
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span className="font-medium">Type: </span>
      <span className="ml-1 text-gray-900 font-medium">{property.type || 'Not specified'}</span>
    </div>
  )

  const renderPhoneNumber = (property) => (
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span className="font-medium">Phone: </span>
      <span className="ml-1 text-gray-900 font-medium">{property.phone_number || 'Not provided'}</span>
    </div>
  )

  const renderActionButtons = (propertyId) => {
    const isApproveLoading = actionLoading === propertyId
    const isRejectLoading = actionLoading === propertyId
    
    return (
      <div className="flex gap-3">
        <button 
          onClick={() => handleApproveProperty(propertyId)} 
          disabled={actionLoading === propertyId}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
        >
          {isApproveLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isApproveLoading ? 'Approving...' : 'Approve'}
        </button>
        <button 
          onClick={() => handleRejectProperty(propertyId)} 
          disabled={actionLoading === propertyId}
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

  const renderPropertyCard = (property) => (
    <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900">
          {property.name || 'Unknown Property'}
        </h4>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
            {renderPropertyType(property)}
            {renderPhoneNumber(property)}
          </div>
          {renderActionButtons(property.id)}
        </div>
      </div>
    </div>
  )

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (pendingProperties.length === 0) return renderEmptyState()

  return (
    <div className="grid gap-6">
      {pendingProperties.map(renderPropertyCard)}
    </div>
  )
}

export default PendingPropertiesPage