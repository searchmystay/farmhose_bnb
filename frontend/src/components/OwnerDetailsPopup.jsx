import React from 'react'

const OwnerDetailsPopup = ({ isOpen, onClose, ownerDetails }) => {
  if (!isOpen || !ownerDetails) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-in-out">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center text-center pt-6 pb-6">
              {ownerDetails.owner_photo ? (
                <img
                  src={ownerDetails.owner_photo}
                  alt={ownerDetails.owner_name || "Property Owner"}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover mb-4 border-4 border-green-100"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-green-100 flex items-center justify-center mb-4 border-4 border-green-200">
                  <span className="text-green-600 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    {ownerDetails.owner_name ? ownerDetails.owner_name.charAt(0).toUpperCase() : 'O'}
                  </span>
                </div>
              )}
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {ownerDetails.owner_name || 'Property Owner'}
              </h3>
              <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium bg-green-100 text-green-800">
                Property Owner
              </span>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6">

            {ownerDetails.owner_description && (
              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center max-h-40 overflow-y-auto">
                  {ownerDetails.owner_description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDetailsPopup