import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { usePropertyDetail, useWhatsappContact, useLeadRegistration, useToggleWishlist, useSearchCriteria } from '../../hooks/usePropertyData'
import Footer from '../../components/Footer'
import VisitorLoginPopup from '../../components/VisitorLoginPopup'
import OwnerDetailsPopup from '../../components/OwnerDetailsPopup'

function ReviewsCarousel({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const getVisibleCards = () => {
    if (window.innerWidth >= 1024) return 4 
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [visibleCards, setVisibleCards] = useState(getVisibleCards)

  const shouldEnableCarousel = reviews.length > visibleCards

  const extendedReviews = shouldEnableCarousel ? [...reviews, ...reviews, ...reviews] : reviews
  const startIndex = shouldEnableCarousel ? reviews.length : 0

  useEffect(() => {
    if (shouldEnableCarousel) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [shouldEnableCarousel])

  useEffect(() => {
    if (shouldEnableCarousel && currentIndex >= startIndex + reviews.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(startIndex)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700)
    }
  }, [currentIndex, startIndex, reviews.length, shouldEnableCarousel])

  useEffect(() => {
    if (shouldEnableCarousel) {
      setCurrentIndex(startIndex)
    } else {
      setCurrentIndex(0)
    }
  }, [startIndex, shouldEnableCarousel])

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!reviews || reviews.length === 0) return null

  const cardWidth = 320
  const cardGap = 24

  const renderStaticReviews = () => {
    const getStaticLayoutClasses = () => {
      if (reviews.length === 1) return "flex justify-center"
      if (reviews.length === 2) return "grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center max-w-4xl mx-auto"
      if (reviews.length === 3) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-5xl mx-auto"
      if (reviews.length === 4) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center max-w-6xl mx-auto"
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
    }

    return (
      <div className={getStaticLayoutClasses()}>
        {reviews.map((review, index) => (
          <div key={`${review.reviewer_name}-${index}`} className="w-full max-w-sm">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-base">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {review.reviewer_name}
                  </h4>
                  {review.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 md:w-4 md:h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {review.review_comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderCarouselReviews = () => {
    return (
      <>
        <div className="overflow-hidden">
          <div 
            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + cardGap)}px)`,
              width: `${extendedReviews.length * (cardWidth + cardGap)}px`
            }}
          >
            {extendedReviews.map((review, index) => (
              <div key={`${review.reviewer_name}-${index}`} className="flex-shrink-0" style={{ width: `${cardWidth}px` }}>
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-base">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                        {review.reviewer_name}
                      </h4>
                      {review.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 md:w-4 md:h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {review.review_comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(startIndex + index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                (currentIndex - startIndex) % reviews.length === index
                  ? 'bg-green-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="relative">
      {shouldEnableCarousel ? renderCarouselReviews() : renderStaticReviews()}
    </div>
  )
}

function PropertyDetailPage() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const { property, loading, error, refetch } = usePropertyDetail(propertyId)
  const { getWhatsappLink, loading: whatsappLoading, error: whatsappError } = useWhatsappContact()
  const { handleLeadInfo, getLeadInfo } = useLeadRegistration()
  const { handleToggleWishlist, loading: wishlistLoading, error: wishlistError } = useToggleWishlist()
  const { hasSearchCriteria, checkSearchCriteria } = useSearchCriteria()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [openDropdown, setOpenDropdown] = useState('core_amenities')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showVisitorPopup, setShowVisitorPopup] = useState(false)
  const [showOwnerDetailsPopup, setShowOwnerDetailsPopup] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleWishlistClick = () => {
    const visitorInfo = getLeadInfo()
    const hasEmail = visitorInfo?.email
    
    if (hasEmail) {
      navigate('/wishlist')
    } else {
      setShowVisitorPopup(true)
    }
  }

  const handleAddToWishlist = async () => {
    const visitorInfo = getLeadInfo()
    const hasEmail = visitorInfo?.email

    if(!hasEmail) {
      setShowVisitorPopup(true)
      return
    }
    
    const result = await handleToggleWishlist(visitorInfo.email, propertyId)
    
    if (result.success) {
      const action = result.data.backend_data?.action || (isInWishlist ? 'removed' : 'added')
      setIsInWishlist(!isInWishlist)
      
      if (action === 'added') {
        toast.success('Property added to wishlist!')
      } else {
        toast.success('Property removed from wishlist!')
      }
    } else {
      toast.error('Failed to update wishlist')
    }
  }

  const handleVisitorSubmit = async (visitorData) => {
    try {
      const result = await handleLeadInfo(visitorData)
      
      if (result.success) {
        setShowVisitorPopup(false)
        await refetch()
        toast.success('Registration successful! You can now add to wishlist.')
      } else {
        console.error('Registration failed:', result.error)
        toast.error('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error handling visitor submission:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handlePopupClose = () => {
    setShowVisitorPopup(false)
  }

  const renderImageGallery = () => {
    if (!property?.images?.length) {
      return (
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      )
    }

    return (
      <div className="w-full">
        <div className="relative mb-4">
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-4 md:grid-cols-6 gap-2">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative overflow-hidden rounded-md aspect-square ${
                index === currentImageIndex ? 'ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderAmenitiesDropdown = () => {
    if (!property?.amenities) return null

    const amenityCategories = Object.entries(property.amenities || {}).map(([key, data]) => ({
      key,
      title: key,
      data
    }))

    const getAvailableAmenities = (categoryData) => {
      if (!categoryData) return []
      
      return Object.entries(categoryData)
        .filter(([key, value]) => {
          if (typeof value === 'boolean') return value === true
          if (typeof value === 'number') return value > 0
          return false
        })
        .map(([key, value]) => ({
          name: key,
          value: typeof value === 'number' ? value : null
        }))
    }

    return (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
        {amenityCategories.map((category) => {
          const availableAmenities = getAvailableAmenities(category.data)
          
          if (availableAmenities.length === 0) return null

          return (
            <div key={category.key} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setOpenDropdown(openDropdown === category.key ? null : category.key)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{category.title}</span>
                {openDropdown === category.key ? (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              
              {openDropdown === category.key && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {availableAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>
                          {amenity.name}
                          {amenity.value && ` (${amenity.value})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const SimpleNavbar = () => {
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
              onClick={handleWishlistClick}
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

  const handleWhatsappContact = async () => {
    try {
      await getWhatsappLink(propertyId)
    } catch (err) {
      toast.error(err.message || 'Unable to contact property owner')
    }
  }

  const renderContactButton = () => {
    if (!hasSearchCriteria) {
      return (
        <>
          <button className="bg-gray-100 text-gray-500 p-2 md:px-4 md:py-2 rounded-full flex items-center justify-center md:gap-2 cursor-not-allowed">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            <span className="hidden md:inline text-sm font-medium">Check Availability First</span>
          </button>
        </>
      )
    }

    return (
      <button 
        onClick={handleWhatsappContact}
        disabled={whatsappLoading}
        className={`${
          whatsappLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        } text-white p-2 md:px-4 md:py-2 rounded-full flex items-center justify-center md:gap-2 transition-colors`}
      >
        {whatsappLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
        )}
        <span className="hidden md:inline text-sm font-medium">
          {whatsappLoading ? 'Loading...' : 'Contact'}
        </span>
      </button>
    )
  }

  const renderOperatingHours = () => {
    if (!property?.opening_time || !property?.closing_time) return null

    return (
      <div className="flex items-center text-gray-700">
        <svg className="w-4 h-4 md:w-5 md:h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm md:text-base">
          Open: {property.opening_time} - {property.closing_time}
        </span>
      </div>
    )
  }

  const renderOwnerDetailsButton = () => {
    if (!property?.owner_details) return null

    return (
      <div className="flex items-center">
        <button 
          onClick={() => setShowOwnerDetailsPopup(true)}
          className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm md:text-base font-medium">View Owner Details</span>
        </button>
      </div>
    )
  }

  const renderReviewsSection = () => {
    if (!property?.reviews?.length) return null

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
        <ReviewsCarousel reviews={property.reviews} />
      </div>
    )
  }

  const renderPropertyInfo = () => {
    const maxLength = 1000
    const description = property.description || ''
    const shouldTruncate = description.length > maxLength
    const displayDescription = showFullDescription || !shouldTruncate 
      ? description 
      : description.substring(0, maxLength) + '...'

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{property.name}</h2>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`${
                    isInWishlist 
                      ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  } ${
                    wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } p-2 md:px-4 md:py-2 rounded-full transition-all duration-200 flex items-center gap-2`}
                >
                  {wishlistLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  <span className="hidden md:inline text-sm font-medium">
                    {wishlistLoading ? 'Updating...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>

                {renderContactButton()}
              </div>
              
              {!hasSearchCriteria && (
                <button 
                  onClick={() => navigate('/search')}
                  className="text-xs text-green-600 hover:text-green-700 font-medium underline mt-1"
                >
                  Fill form to check availability
                </button>
              )}
            </div>
          </div>
          <div className="text-gray-600 leading-relaxed">
            <p className="text-sm md:text-base">{displayDescription}</p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-green-600 hover:text-green-700 font-medium mt-2 transition-colors"
              >
                {showFullDescription ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm md:text-base">{property.location.address}</span>
            <span className="ml-2 text-gray-500 text-sm md:text-base">- {property.location.pin_code}</span>
          </div>

          {renderOperatingHours()}
          {renderOwnerDetailsButton()}
        </div>

        {renderAmenitiesDropdown()}
      </div>
    )
  }

  const renderLoadingState = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  const renderErrorState = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (property?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [property?.images])

  useEffect(() => {
    if (property) {
      const wishlistStatus = property.in_wishlist || false
      setIsInWishlist(wishlistStatus)
    }
  }, [property])

  useEffect(() => {
    checkSearchCriteria()
  }, [])

  if (loading) return renderLoadingState()
  if (error) return renderErrorState()
  if (!property) return renderErrorState()

  return (
    <>
      <Helmet>
        <title>{property.name} | Property Details</title>
        <meta name="description" content={property.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <SimpleNavbar />
        
        <div className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8">
            <div className="order-1 lg:order-1">
              {renderImageGallery()}
            </div>
            
            <div className="order-2 lg:order-2">
              {renderPropertyInfo()}
            </div>
          </div>

          <div className="mb-12">
            {renderReviewsSection()}
          </div>
        </div>
        
        <Footer />
      </div>

      <VisitorLoginPopup 
        isOpen={showVisitorPopup}
        onClose={handlePopupClose}
        onSubmit={handleVisitorSubmit}
      />

      <OwnerDetailsPopup 
        isOpen={showOwnerDetailsPopup}
        onClose={() => setShowOwnerDetailsPopup(false)}
        ownerDetails={property?.owner_details}
      />
    </>
  )
}

export default PropertyDetailPage