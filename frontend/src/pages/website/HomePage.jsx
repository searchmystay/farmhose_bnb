import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import { useTopProperties } from '../../hooks/usePropertyData'


// Component for full-screen hero with scrolling background
function HeroSection() {
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

      <div className="absolute top-8 left-8 z-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white">SearchMyStay</h2>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
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
            onClick={() => {}}
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

// Component for infinite auto-carousel farmhouse section
function FarmhouseCarousel({ title, properties, loading, error }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const extendedProperties = [...properties, ...properties, ...properties]
  const startIndex = properties.length 

  useEffect(() => {
    if (properties.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [properties.length])

  useEffect(() => {
    if (currentIndex >= startIndex + properties.length && properties.length > 0) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(startIndex)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700) 
    }
  }, [currentIndex, startIndex, properties.length])

  useEffect(() => {
    if (properties.length > 0) {
      setCurrentIndex(startIndex)
    }
  }, [startIndex, properties.length])

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        
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
        ) : (
          <>
            <div className="relative overflow-hidden">
              <div 
                className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
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
        )}
      </div>
    </section>
  )
}

// Component for property registration call-to-action section
function PropertyRegistrationSection() {
  const navigate = useNavigate()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            List Your Property
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Share your beautiful farmhouse or BnB with travelers seeking authentic experiences
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Join our trusted community of property owners
          </p>
          
          
          <button
            onClick={() => navigate('/register-property')}
            className="bg-green-600 text-white px-12 py-5 rounded-full text-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Register Your Property
          </button>
        </div>
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
        
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Verified Properties
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fraud-Free Platform
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quality Assured
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// Main homepage component that renders all sections
function HomePage() {
  const { topFarmhouses, topBnbs, loading, error } = useTopProperties()

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
        <HeroSection />
        
        <div className="pt-8 bg-gray-50">
          <FarmhouseCarousel 
            title="Popular Farmhouses in Jaipur" 
            properties={topFarmhouses} 
            loading={loading} 
            error={error} 
          />
        </div>
        
        <FarmhouseCarousel 
          title="Popular BnB in Jaipur" 
          properties={topBnbs} 
          loading={loading} 
          error={error} 
        />
        
        <PropertyRegistrationSection />
        <TestimonialsSection />
        <Footer />
      </div>
      
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