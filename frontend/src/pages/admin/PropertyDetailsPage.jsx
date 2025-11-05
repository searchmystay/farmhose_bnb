import { useState } from 'react'
import { useAdminPropertyDetails } from '../../hooks/useAdmin'

function PropertyDetailsPage({ propertyId, onBack }) {
  const { propertyDetails, isLoading, error, refetch } = useAdminPropertyDetails(propertyId)
  const [activeTab, setActiveTab] = useState('basic')

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <span className="text-gray-600 text-sm sm:text-base">Loading property details...</span>
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
        <div className="flex gap-3 justify-center">
          <button onClick={refetch} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Try Again
          </button>
          <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base">
            Back to Properties
          </button>
        </div>
      </div>
    </div>
  )

  const renderAmenities = (amenities) => {
    if (!amenities || Object.keys(amenities).length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          No amenities information available
        </div>
      )
    }

    const categoryLabels = {
      core_amenities: 'Core Amenities',
      bedroom_bathroom: 'Bedroom & Bathroom',
      outdoor_garden: 'Outdoor & Garden',
      food_dining: 'Food & Dining',
      entertainment_activities: 'Entertainment & Activities',
      pet_family_friendly: 'Pet & Family Friendly',
      safety_security: 'Safety & Security',
      experience_luxury_addons: 'Experience & Luxury Add-ons',
      house_rules_services: 'House Rules & Services'
    }

    return (
      <div className="space-y-4">
        {Object.entries(amenities).map(([categoryKey, categoryValue]) => {
          if (!categoryValue || Object.keys(categoryValue).length === 0) return null
          
          const categoryLabel = categoryLabels[categoryKey] || categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          
          return (
            <details key={categoryKey} className="border border-gray-200 rounded-lg">
              <summary className="cursor-pointer bg-gray-50 px-4 py-3 font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                {categoryLabel}
              </summary>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(categoryValue).map(([amenityKey, amenityValue]) => {
                  const amenityLabel = amenityKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  
                  let displayValue = ''
                  let statusClass = ''
                  
                  if (typeof amenityValue === 'boolean') {
                    displayValue = amenityValue ? 'Available' : 'Not Available'
                    statusClass = amenityValue ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  } else if (typeof amenityValue === 'number') {
                    displayValue = amenityValue.toString()
                    statusClass = 'text-blue-600 bg-blue-50'
                  } else {
                    displayValue = amenityValue || 'Not specified'
                    statusClass = 'text-gray-600 bg-gray-50'
                  }
                  
                  return (
                    <div key={amenityKey} className="flex justify-between items-center py-2 px-3 bg-white border border-gray-100 rounded">
                      <span className="text-sm text-gray-700">{amenityLabel}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
                        {displayValue}
                      </span>
                    </div>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    )
  }

  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex items-center justify-between">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Details
          </button>
          <button
            onClick={() => setActiveTab('owner')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'owner'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Owner Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents & Images
          </button>
        </nav>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm py-2 px-3 rounded-md hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back to Properties</span>
        </button>
      </div>
    </div>
  )

  const renderBasicDetails = () => {
    const basic = propertyDetails?.basic_details
    if (!basic) return null

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Property Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{basic.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md capitalize">{basic.type || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{basic.opening_time || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{basic.closing_time || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per Day Cost</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">₹{basic.per_day_cost || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max People Allowed</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{basic.max_people || 0} people</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{basic.address || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[100px] whitespace-pre-wrap">{basic.description || 'No description provided'}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h4>
          {renderAmenities(basic.amenities)}
        </div>
      </div>
    )
  }

  const renderOwnerDetails = () => {
    const owner = propertyDetails?.owner_details
    if (!owner) return null

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{owner.owner_name || 'Not provided'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dashboard ID</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md font-mono text-sm">{owner.owner_dashboard_id || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dashboard Password</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md font-mono text-sm">{owner.owner_dashboard_password || 'Not provided'}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Description</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[100px] whitespace-pre-wrap">{owner.owner_description || 'No description provided'}</p>
            </div>
          </div>
          
          {owner.owner_photo && (
            <div className="flex-shrink-0 lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-3">Owner Photo</label>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-gray-50 p-4 rounded-md">
                  <img 
                    src={owner.owner_photo} 
                    alt="Owner" 
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDocumentsAndImages = () => {
    const documentsImages = propertyDetails?.documents_images
    if (!documentsImages) return null

    return (
      <div className="space-y-6">
        {/* Documents Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
          {documentsImages.documents && documentsImages.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentsImages.documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-gray-900 capitalize text-sm">
                      {doc.type.replace('_', ' ')}
                    </span>
                  </div>
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    View Document
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No documents available</p>
          )}
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
          {documentsImages.images && documentsImages.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documentsImages.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No images available</p>
          )}
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicDetails()
      case 'owner':
        return renderOwnerDetails()
      case 'documents':
        return renderDocumentsAndImages()
      default:
        return renderBasicDetails()
    }
  }

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState()
  if (!propertyDetails) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {renderTabNavigation()}
      {renderTabContent()}
    </div>
  )
}

export default PropertyDetailsPage