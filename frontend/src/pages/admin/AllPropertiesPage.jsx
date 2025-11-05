import { useAllProperties } from '../../hooks/useAdmin'

function AllPropertiesPage({ onViewDetails }) {
  const { allProperties, isLoading, error, actionLoading, refetch, handleToggleFavourite } = useAllProperties()

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <span className="text-gray-600 text-sm sm:text-base">Loading all properties...</span>
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
        <p className="text-gray-600 text-base sm:text-lg">No properties found</p>
        <p className="text-gray-500 text-sm sm:text-base mt-2">No properties are currently available</p>
      </div>
    </div>
  )

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'Unknown'}
      </span>
    )
  }

  const handleFavouriteClick = (propertyId, currentFavouriteStatus) => {
    console.log('Favourite clicked for property:', propertyId)
    handleToggleFavourite(propertyId, currentFavouriteStatus)
  }

  const renderPropertyRow = (property) => (
    <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Property Name - Full width on mobile, larger on tablets */}
        <div className="flex-1 lg:flex-[2] min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-1">Property Name</div>
          <button
            onClick={() => onViewDetails && onViewDetails(property.id)}
            className="font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base block truncate text-left transition-colors w-full"
          >
            {property.name || 'Unknown Property'}
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-4 lg:gap-6 lg:flex-[2]">
          <div className="flex-1 min-w-0 mb-3 sm:mb-0">
            <div className="text-xs font-medium text-gray-500 mb-1">Type</div>
            <span className="text-gray-600 text-sm block truncate">{property.type || 'Not specified'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 mb-1">Phone Number</div>
            <span className="text-gray-600 text-sm block truncate">{property.phone_number || 'Not provided'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:gap-6 lg:flex-[1]">
          <div className="flex-1 min-w-0 mb-3 sm:mb-0">
            <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
            {getStatusBadge(property.status)}
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleFavouriteClick(property.id, property.favourite)} 
              disabled={actionLoading === property.id}
              className={`${property.favourite ? 'bg-amber-500 hover:bg-amber-600 shadow-lg' : 'bg-blue-600 hover:bg-blue-700 shadow-md'} text-white px-4 py-2.5 sm:px-5 lg:px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap min-w-[120px] sm:min-w-[140px]`}
            >
              {actionLoading === property.id ? (
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill={property.favourite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {actionLoading === property.id 
                  ? 'Updating...' 
                  : (property.favourite ? 'Remove Favourite' : 'Add Favourite')
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (allProperties.length === 0) return renderEmptyState()

  return (
    <div className="grid gap-4">
      {allProperties.map(renderPropertyRow)}
    </div>
  )
}

export default AllPropertiesPage