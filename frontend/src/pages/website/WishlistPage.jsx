import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useUserWishlist, useLeadRegistration } from '../../hooks/usePropertyData'
import Footer from '../../components/Footer'
import VisitorLoginPopup from '../../components/VisitorLoginPopup'

const SearchNavbar = () => {
  const navigate = useNavigate()
  
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <img 
              src="/search_my_stay_logo.svg" 
              alt="Search My Stay" 
              className="h-6 md:h-8 w-auto"
              style={{ filter: 'brightness(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const FarmhouseCard = ({ property, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = property.images || [property.image]

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [images.length])

  return (
    <div 
      onClick={() => onClick?.(property._id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-80 h-96 flex-shrink-0 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={`${property.name} - Image ${currentImageIndex + 1}`} 
          className="w-full h-48 object-cover transition-opacity duration-500"
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg mb-2 text-gray-900">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-grow">{property.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {property.amenities && property.amenities.map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading properties...</h3>
    <p className="text-gray-600 text-center max-w-md">
      Please wait while we fetch the latest property listings for you.
    </p>
  </div>
)

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load properties</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">
      We're having trouble loading the properties right now. Please try again later.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      Try Again
    </button>
  </div>
)

const EmptyState = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-center max-w-md">{description}</p>
  </div>
)

const PropertiesGrid = ({ properties, onPropertyClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mx-2 justify-items-center">
    {properties.map(property => (
      <FarmhouseCard 
        key={property._id} 
        property={property} 
        onClick={onPropertyClick}
      />
    ))}
  </div>
)

function WishlistPage() {
  const navigate = useNavigate()
  const { wishlistProperties, loading, error, userEmail } = useUserWishlist()
  const { handleLeadInfo } = useLeadRegistration()
  const [showVisitorPopup, setShowVisitorPopup] = useState(false)

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`)
  }

  const handleLoginClick = () => {
    setShowVisitorPopup(true)
  }

  const handlePopupClose = () => {
    setShowVisitorPopup(false)
  }

  const handleVisitorSubmit = async (visitorData) => {
    try {
      const result = await handleLeadInfo(visitorData)
      
      if (result.success) {
        setShowVisitorPopup(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Registration failed:', error.message)
    }
  }


  if (!userEmail) {
    return (
      <>
        <Helmet>
          <title>My Wishlist | Find Your Perfect Stay</title>
          <meta name="description" content="View your saved properties and favorite farmhouse listings" />
        </Helmet>

        <div className="min-h-screen bg-white flex flex-col">
          <SearchNavbar />

          <section className="bg-gray-50 py-6 md:py-12 flex-grow flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">
                Please Login
              </h1>
              <p className="text-sm md:text-lg text-gray-600 mb-6">
                You need to login to view your wishlist.
              </p>
              <button
                onClick={handleLoginClick}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Login Now
              </button>
            </div>
          </section>

          <Footer />
        </div>
        
        <VisitorLoginPopup 
          isOpen={showVisitorPopup}
          onClose={handlePopupClose}
          onSubmit={handleVisitorSubmit}
        />
      </>
    )
  }

  const renderWishlistContent = () => {
    if (loading) return <LoadingState />
    if (error) return <ErrorState />
    if (wishlistProperties.length === 0) {
      return (
        <div className="text-center py-4">
          <EmptyState 
            title="Your wishlist is empty"
            description="Start exploring properties and add your favorites here!"
          />
          <button
            onClick={() => navigate('/farmhouse')}
            className="mt-4 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Properties
          </button>
        </div>
      )
    }
    return <PropertiesGrid properties={wishlistProperties} onPropertyClick={handlePropertyClick} />
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist | Find Your Perfect Stay</title>
        <meta name="description" content="View your saved properties and favorite farmhouse listings" />
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
        <SearchNavbar />

        <section className="bg-gray-50 py-6 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">
              Welcome back, {userEmail}
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              {wishlistProperties.length} {wishlistProperties.length === 1 ? 'property' : 'properties'} in your wishlist
            </p>
          </div>
        </section>

        <section className="py-4 md:py-8 bg-gray-50 flex-grow">
          <div className="container mx-auto px-4">
            {renderWishlistContent()}
          </div>
        </section>

        <Footer />
      </div>
      
      <VisitorLoginPopup 
        isOpen={showVisitorPopup}
        onClose={handlePopupClose}
        onSubmit={handleVisitorSubmit}
      />
    </>
  )
}

export default WishlistPage