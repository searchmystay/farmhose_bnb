import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { usePropertyDetail, useWhatsappContact } from '../../hooks/usePropertyData'
import Footer from '../../components/Footer'

function PropertyDetailPage() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const { property, loading, error, refetch } = usePropertyDetail(propertyId)
  const { getWhatsappLink, loading: whatsappLoading, error: whatsappError } = useWhatsappContact()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [openDropdown, setOpenDropdown] = useState('core_amenities')
  const [showFullDescription, setShowFullDescription] = useState(false)

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
              onClick={() => {}}
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
            <div className="flex items-center gap-2">
              {/* Add to Wishlist Button */}
              <button 
                onClick={() => {}}
                className="bg-white border border-gray-300 text-gray-700 p-2 md:px-4 md:py-2 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden md:inline text-sm font-medium">Add to Wishlist</span>
              </button>

              {/* WhatsApp Contact Button */}
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
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513"/>
                </svg>
              )}
              <span className="hidden md:inline text-sm font-medium">
                {whatsappLoading ? 'Loading...' : 'Contact'}
              </span>
            </button>
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
            <span className="text-sm md:text-base">{property.location?.address}</span>
            {property.location?.pin_code && (
              <span className="ml-2 text-gray-500 text-sm md:text-base">- {property.location.pin_code}</span>
            )}
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-12">
            <div className="order-1 lg:order-1">
              {renderImageGallery()}
            </div>
            
            <div className="order-2 lg:order-2">
              {renderPropertyInfo()}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}

export default PropertyDetailPage