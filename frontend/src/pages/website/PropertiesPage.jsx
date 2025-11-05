import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFarmhouseList, useBnbList, useLeadRegistration } from '../../hooks/usePropertyData'
import Footer from '../../components/Footer'
import VisitorLoginPopup from '../../components/VisitorLoginPopup'


const SearchNavbar = ({ onWishlistClick }) => {
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

          <button 
            onClick={onWishlistClick}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </button>
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

function PropertiesPage({ propertyType = 'both' } = {}) {
  const navigate = useNavigate()
  const { handleLeadInfo, getLeadInfo } = useLeadRegistration()
  const [showVisitorPopup, setShowVisitorPopup] = useState(false)
  
  const shouldFetchFarmhouses = propertyType === 'farmhouse' || propertyType === 'both'
  const shouldFetchBnbs = propertyType === 'bnb' || propertyType === 'both'
  const { farmhouses, loading: farmhouseLoading, error: farmhouseError } = useFarmhouseList(shouldFetchFarmhouses)
  const { bnbs, loading: bnbLoading, error: bnbError } = useBnbList(shouldFetchBnbs)
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (propertyType === 'farmhouse') {
      setProperties(farmhouses)
      setLoading(farmhouseLoading)
      setError(farmhouseError)
    } else if (propertyType === 'bnb') {
      setProperties(bnbs)
      setLoading(bnbLoading)
      setError(bnbError)
    } else {
      const allProperties = [...farmhouses, ...bnbs]
      setProperties(allProperties)
      setLoading(farmhouseLoading || bnbLoading)
      setError(farmhouseError || bnbError)
    }
  }, [propertyType, farmhouses, bnbs, farmhouseLoading, bnbLoading, farmhouseError, bnbError])

  const getTitle = () => {
    switch (propertyType) {
      case 'farmhouse':
        return 'Farmhouses'
      case 'bnb':
        return 'Bed & Breakfast'
      case 'both':
      default:
        return 'Farmhouses & BnB'
    }
  }

  const handleWishlistClick = () => {
    const visitorInfo = getLeadInfo()
    const hasEmail = visitorInfo?.email
    
    if (hasEmail) {
      navigate('/wishlist')
    } else {
      setShowVisitorPopup(true)
    }
  }

  const handleVisitorSubmit = async (visitorData) => {
    try {
      const result = await handleLeadInfo(visitorData)
      
      if (result.success) {
        console.log('Visitor registered successfully:', result.data)
        setShowVisitorPopup(false)
        navigate('/wishlist')
      } else {
        console.error('Registration failed:', result.error)
      }
    } catch (error) {
      console.error('Error handling visitor submission:', error)
    }
  }

  const handlePopupClose = () => {
    setShowVisitorPopup(false)
  }

  const getDescription = () => {
    switch (propertyType) {
      case 'farmhouse':
        return 'Discover serene farmhouses perfect for peaceful getaways and nature retreats'
      case 'bnb':
        return 'Experience cozy bed & breakfast accommodations with personalized hospitality'
      case 'both':
      default:
        return 'Choose from our curated collection of farmhouses and bed & breakfast properties'
    }
  }

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 mt-4 text-lg">Loading {getTitle().toLowerCase()}...</p>
      <p className="text-gray-500 mt-2 text-sm">Please wait while we fetch the best properties for you</p>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
      <p className="text-gray-600 text-center max-w-md">
        We couldn't find any {getTitle().toLowerCase()} at the moment. Please check back later for new listings.
      </p>
    </div>
  )

  const renderPropertiesGrid = () => (
    <div className="flex gap-6 justify-center flex-wrap">
      {properties.map(property => (
        <FarmhouseCard 
          key={property._id} 
          property={property} 
          onClick={(propertyId) => navigate(`/property/${propertyId}`)}
        />
      ))}
    </div>
  )

  const renderPropertiesContent = () => {
    if (loading) return renderLoadingState()
    if (error) return renderErrorState()
    if (properties.length === 0) return renderEmptyState()
    return renderPropertiesGrid()
  }

  return (
    <>
      <Helmet>
        <title>{getTitle()} Properties | Find Your Perfect Stay</title>
        <meta name="description" content={getDescription()} />
        <meta name="keywords" content="farmhouse listings, bnb properties, vacation rentals, farm stay" />
      </Helmet>

      <div className="min-h-screen bg-white flex flex-col">
        <SearchNavbar onWishlistClick={handleWishlistClick} />

        {/* Heading Section */}
        <section className="bg-gray-50 py-6 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">
              {getTitle()}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              {getDescription()}
            </p>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-6 md:py-12 bg-gray-50 flex-grow">
          <div className="container mx-auto px-4">
            {renderPropertiesContent()}
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

export default PropertiesPage