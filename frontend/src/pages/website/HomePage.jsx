import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import { useTopProperties, useLeadRegistration } from '../../hooks/usePropertyData'
import VisitorLoginPopup from '../../components/VisitorLoginPopup'


// Component for full-screen hero with scrolling background
function HeroSection({ onWishlistClick }) {
  const navigate = useNavigate()
  
  const backgroundImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop&auto=format"
  ]

  return (
    <section className="relative h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0 opacity-60">
        <div className="flex animate-scroll-slow h-full">
          {[...backgroundImages, ...backgroundImages, ...backgroundImages].map((image, index) => (
            <div key={index} className="w-screen h-full flex-shrink-0">
              <img 
                src={image} 
                alt="Beautiful Properties" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-3 left-3 md:top-8 md:left-8 z-20">
        <img 
          src="/search_my_stay_logo.svg" 
          alt="Search My Stay" 
          className="h-6 md:h-12 w-auto"
        />
      </div>

      <div className="absolute top-3 right-3 md:top-8 md:right-8 z-20">
        <div className="flex gap-1 md:gap-4">
          <button 
            onClick={() => navigate('/register-property')}
            className="bg-white/10 backdrop-blur text-white border border-white/30 px-2 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base font-medium hover:bg-white/20 transition-all duration-200"
          >
            Register
          </button>
          <button 
            onClick={onWishlistClick}
            className="bg-white/10 backdrop-blur text-white border border-white/30 px-2 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base font-medium hover:bg-white/20 transition-all duration-200"
          >
            Wishlist
          </button>
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <h1 className="hero-heading text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight">
          Find Your Perfect Stay
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl leading-relaxed">
          Discover handpicked farmhouses and boutique stays
        </p>
        <p className="text-base md:text-lg text-white/80 mb-12 max-w-xl">
          Escape to serene locations and create unforgettable memories
        </p>
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/search')}
            className="bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Search Your Stay
          </button>
        </div>
      </div>
    </section>
  )
}

// Component for enhanced farmhouse card with auto-changing images
function FarmhouseCard({ property }) {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = property.images || []

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [images.length])

  const handleCardClick = () => {
    navigate(`/property/${property._id}`)
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-80 h-96 flex-shrink-0 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {images.length > 0 ? (
          <img 
            src={images[currentImageIndex]} 
            alt={`${property.name} - Image ${currentImageIndex + 1}`} 
            className="w-full h-48 object-cover transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
        
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
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-start gap-1.5 flex-1">
            <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-600 line-clamp-2">
              {(() => {
                const address = property.location?.address || 'Address not available'
                const words = address.split(' ')
                return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : address
              })()}
            </span>
          </div>
          
          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              {property.review_average ? property.review_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FarmhouseCarousel({ title, properties, loading, error, navigateTo }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const getVisibleCards = () => {
    if (window.innerWidth >= 1024) return 4 
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [visibleCards, setVisibleCards] = useState(getVisibleCards)

  const shouldEnableCarousel = properties.length > visibleCards

  const extendedProperties = shouldEnableCarousel ? [...properties, ...properties, ...properties] : properties
  const startIndex = shouldEnableCarousel ? properties.length : 0

  useEffect(() => {
    if (shouldEnableCarousel) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [shouldEnableCarousel])

  useEffect(() => {
    if (shouldEnableCarousel && currentIndex >= startIndex + properties.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(startIndex)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700)
    }
  }, [currentIndex, startIndex, properties.length, shouldEnableCarousel])

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

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 
          onClick={() => navigateTo && navigate(navigateTo)}
          className={`text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 ${navigateTo ? 'cursor-pointer group' : ''}`}
        >
          <span>
            {title}
            {navigateTo && (
              <svg 
                className="inline-block w-4 h-4 md:w-5 md:h-5 ml-1 align-middle transition-transform duration-200 group-hover:translate-x-0.5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            )}
          </span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="ml-3 text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-600">No properties available</p>
          </div>
        ) : shouldEnableCarousel ? (
          <>
            <div className="relative overflow-hidden">
              <div 
                className={`flex gap-6 pr-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * (320 + 24)}px)`,
                  width: `${extendedProperties.length * (320 + 24)}px`
                }}
              >
                {extendedProperties.map((property, index) => (
                  <div key={`${property.id || property.name}-${index}`} className="flex-shrink-0">
                    <FarmhouseCard property={property} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(startIndex + index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    (currentIndex - startIndex) % properties.length === index
                      ? 'bg-green-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={`${
            properties.length === 1 ? 'flex justify-center' : 
            properties.length === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center' :
            properties.length === 3 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center' :
            'flex gap-6 justify-center flex-wrap'
          }`}>
            {properties.map((property, index) => (
              <div key={`${property.id || property.name}-${index}`}>
                <FarmhouseCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


// Component for testimonials section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Arjun Malhotra",
      location: "Delhi",
      text: "This platform is incredibly trustworthy! Every farmhouse is thoroughly verified before listing. I found exactly what was promised - no hidden surprises or fraud. The quality assurance is exceptional.",
      rating: 5,
      verified: true
    },
    {
      name: "Sneha Patel",
      location: "Mumbai", 
      text: "Finally, a reliable website for farmhouse bookings! The verification process gives me complete confidence. All properties are genuine and match the descriptions perfectly. Outstanding service quality.",
      rating: 5,
      verified: true
    },
    {
      name: "Vikram Singh",
      location: "Bangalore",
      text: "Best platform for verified farmhouse rentals! No fraudulent listings, everything is authenticated. The website's commitment to quality and transparency is remarkable. Highly trusted by travelers.",
      rating: 5,
      verified: true
    },
    {
      name: "Kavita Sharma",
      location: "Pune",
      text: "Exceptional verification standards! This website ensures every property owner is legitimate and properties are exactly as advertised. Safe, secure, and completely fraud-free experience every time.",
      rating: 5,
      verified: true
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Thousands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trust our verified platform for authentic farmhouse and BnB experiences
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {testimonial.verified && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>
              
              <div className="border-t pt-3">
                <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-gray-500 text-xs">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}


function HomePage() {
  const navigate = useNavigate()
  const { topFarmhouses, topBnbs, loading, error } = useTopProperties()
  const { handleLeadInfo, getLeadInfo } = useLeadRegistration()
  const [showVisitorPopup, setShowVisitorPopup] = useState(false)

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

  return (
    <>
      <Helmet>
        <title>Best Farmhouses & BnB for Rent in Jaipur | FarmStay Bookings</title>
        <meta name="description" content="Discover and book premium farmhouses and bed & breakfast accommodations in Jaipur. Perfect for weekend getaways, family vacations, and peaceful retreats." />
        <meta name="keywords" content="farmhouse rental Jaipur, BnB booking Jaipur, farm stay, weekend getaway, vacation rental" />
        <meta property="og:title" content="Best Farmhouses & BnB for Rent in Jaipur | FarmStay Bookings" />
        <meta property="og:description" content="Discover and book premium farmhouses and bed & breakfast accommodations in Jaipur." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <HeroSection onWishlistClick={handleWishlistClick} />
        
        <FarmhouseCarousel 
          title="Popular Farmhouses in Jaipur" 
          properties={topFarmhouses} 
          loading={loading} 
          error={error} 
          navigateTo="/farmhouse"
        />
        
        <FarmhouseCarousel 
          title="Popular BnB in Jaipur" 
          properties={topBnbs} 
          loading={loading} 
          error={error} 
          navigateTo="/bnb"
        />
        
        <TestimonialsSection />
        <Footer />
      </div>

      <VisitorLoginPopup 
        isOpen={showVisitorPopup}
        onClose={handlePopupClose}
        onSubmit={handleVisitorSubmit}
      />
      
      <style jsx>{`
        @keyframes scroll-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-slow {
          animation: scroll-slow 45s linear infinite;
          width: 300%;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default HomePage