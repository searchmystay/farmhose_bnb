import { useAllProperties } from '../../hooks/useAdmin'

const IncompletePropertiesPage = ({ onViewDetails }) => {
  const { allProperties, isLoading, error } = useAllProperties()

  const incompleteProperties = allProperties.filter(
    property => property.status === 'incomplete'
  )

  const getStatusBadge = (status) => {
    const statusStyles = {
      incomplete: 'bg-gray-100 text-gray-800 border border-gray-300'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    )
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  )

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Incomplete Properties</h3>
      <p className="text-gray-600">All properties have been completed or there are no registrations in progress.</p>
    </div>
  )

  const getSafeValue = (value, fallback = 'Not Available') => {
    if (value === null || value === undefined || value === '') {
      return fallback
    }
    return value
  }

  const getSafeCreditBalance = (balance) => {
    if (balance === null || balance === undefined || isNaN(balance)) {
      return { value: 'Not Available', colorClass: 'text-gray-500' }
    }
    const colorClass = balance <= 100 ? 'text-red-600' : balance <= 500 ? 'text-orange-600' : 'text-green-600'
    return { value: `₹${balance.toLocaleString('en-IN')}`, colorClass }
  }

  const renderPropertyRow = (property) => {
    const creditInfo = getSafeCreditBalance(property?.credit_balance)
    
    return (
      <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Property Name - Full width on mobile, larger on tablets */}
          <div className="flex-1 lg:flex-[2] min-w-0">
            <div className="text-xs font-medium text-gray-500 mb-1">Property Name</div>
            <button
              onClick={() => onViewDetails && onViewDetails(property.id)}
              className="font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base block truncate text-left transition-colors w-full"
            >
              {getSafeValue(property?.name, 'Unknown Property')}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:gap-4 lg:gap-6 lg:flex-[3]">
            <div className="flex-1 min-w-0 mb-3 sm:mb-0">
              <div className="text-xs font-medium text-gray-500 mb-1">Type</div>
              <span className="text-gray-600 text-sm block truncate">{getSafeValue(property?.type, 'Not Specified')}</span>
            </div>
            <div className="flex-1 min-w-0 mb-3 sm:mb-0">
              <div className="text-xs font-medium text-gray-500 mb-1">Phone Number</div>
              <span className="text-gray-600 text-sm block truncate">{getSafeValue(property?.phone_number, 'Not Provided')}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 mb-1">Credit Balance</div>
              <span className={`text-sm font-semibold block truncate ${creditInfo.colorClass}`}>
                {creditInfo.value}
              </span>
            </div>
          </div>
        
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:gap-6 lg:flex-[1]">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
              <div className="flex items-center gap-3">
                {getStatusBadge(property?.status || 'incomplete')}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (incompleteProperties.length === 0) return renderEmptyState()

  return (
    <div className="grid gap-4">
      {incompleteProperties.map(renderPropertyRow)}
    </div>
  )
}

export default IncompletePropertiesPage
