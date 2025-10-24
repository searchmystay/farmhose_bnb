import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'

// Mock data constants - replace with API calls later
const POPULAR_FARMHOUSES = [
  {
    id: 1,
    name: "Royal Heritage Villa",
    description: "Experience luxury in this stunning heritage villa featuring traditional Rajasthani architecture, spacious gardens, and modern amenities for an unforgettable stay.",
    images: [
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Pool", "Garden", "Kitchen"]
  },
  {
    id: 2,
    name: "Serenity Farm Retreat",
    description: "Peaceful countryside escape with organic gardens, traditional mud houses, and panoramic views of Aravalli hills. Perfect for nature lovers.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Garden", "Organic Farm", "Yoga Space"]
  },
  {
    id: 3,
    name: "Rajputana Palace Farm",
    description: "Majestic palace-style farmhouse with regal interiors, large courtyards, and authentic Rajasthani hospitality. Ideal for grand celebrations.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Pool", "Banquet Hall", "Catering"]
  },
  {
    id: 4,
    name: "Green Valley Farmhouse",
    description: "Eco-friendly farmhouse surrounded by lush greenery and fruit orchards. Features solar power, rainwater harvesting, and sustainable living.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Solar Power", "Orchard", "Cycling"]
  },
  {
    id: 5,
    name: "Desert Oasis Villa",
    description: "Unique desert-themed farmhouse with camel safari arrangements, folk music evenings, and stunning sunset views. Experience authentic culture.",
    images: [
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Camel Safari", "Folk Music", "Bonfire"]
  }
]

const POPULAR_BNBS = [
  {
    id: 1,
    name: "Cozy Heritage Homestay",
    description: "Charming traditional homestay in the heart of Pink City with warm hospitality, home-cooked meals, and authentic Rajasthani cultural experience.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Breakfast", "AC", "Parking", "Local Guide"]
  },
  {
    id: 2,
    name: "Royal Heritage House",
    description: "Luxurious heritage property with traditional architecture, antique furnishings, and modern amenities for a royal experience in Jaipur.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Heritage Decor", "Butler Service", "Courtyard", "Cultural Tours"]
  },
  {
    id: 3,
    name: "Garden View Retreat",
    description: "Peaceful retreat surrounded by lush gardens and flowering plants. Ideal for nature lovers seeking tranquility within the bustling city.",
    images: [
      "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Garden Access", "Balcony", "Bird Watching", "Meditation Area"]
  },
  {
    id: 4,
    name: "Modern City Center Stay",
    description: "Contemporary accommodation in the heart of Jaipur with modern amenities and easy access to major attractions, markets, and restaurants.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "AC", "Elevator", "City View"]
  },
  {
    id: 5,
    name: "Traditional Rajasthani BnB",
    description: "Authentic Rajasthani experience with traditional decor, local cuisine, and cultural activities. Perfect for immersing in local heritage and traditions.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop"
    ],
    amenities: ["WiFi", "Traditional Decor", "Local Cuisine", "Folk Music", "Handicraft Tours"]
  }
]

const TESTIMONIALS = [
  { id: 1, name: "Rahul Sharma", text: "Amazing farmhouse experience! Perfect for family getaway.", rating: 5 },
  { id: 2, name: "Priya Gupta", text: "Beautiful location and excellent hospitality. Highly recommended!", rating: 5 },
  { id: 3, name: "Amit Singh", text: "Peaceful retreat with all modern amenities. Will visit again.", rating: 5 }
]


// Component for full-screen hero with scrolling background
function HeroSection() {
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
        <div className="flex gap-4 mb-12">
          <button className="bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-200">
            Farmhouse
          </button>
          <button className="bg-gray-900/50 backdrop-blur text-white border border-white/30 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-900/70 transition-all duration-200">
            BnB
          </button>
        </div>
        <div className="w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Search your stay..." 
            className="w-full px-6 py-4 rounded-full text-white placeholder-white/70 bg-white/10 backdrop-blur border border-white/30 text-lg focus:ring-2 focus:ring-white/50 focus:outline-none focus:bg-white/20 transition-all duration-200"
          />
        </div>
      </div>
    </section>
  )
}

// Component for enhanced farmhouse card with auto-changing images
function FarmhouseCard({ property }) {
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-80 flex-shrink-0 overflow-hidden">
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

      <div className="p-4 flex flex-col">
        <h3 className="font-medium text-lg mb-2 text-gray-900">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3">{property.description}</p>
        
        <div className="flex flex-wrap gap-1.5">
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

// Component for simple BnB card display
function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow min-w-72 flex-shrink-0">
      <img src={property.image} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold">{property.price}/night</span>
          <button className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition-colors">View</button>
        </div>
      </div>
    </div>
  )
}

// Component for infinite auto-carousel farmhouse section
function FarmhouseCarousel({ title, properties }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const extendedProperties = [...properties, ...properties, ...properties]
  const startIndex = properties.length 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentIndex >= startIndex + properties.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(startIndex)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 700) 
    }
  }, [currentIndex, startIndex, properties.length])

  useEffect(() => {
    setCurrentIndex(startIndex)
  }, [startIndex])

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        
        <div className="relative overflow-hidden">
          <div 
            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * (320 + 24)}px)`,
              width: `${extendedProperties.length * (320 + 24)}px`
            }}
          >
            {extendedProperties.map((property, index) => (
              <div key={`${property.id}-${index}`} className="flex-shrink-0">
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
      </div>
    </section>
  )
}

// Component for scrollable property section (for BnBs)
function PropertySection({ title, properties }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
          {properties.map(property => 
            <PropertyCard key={property.id} property={property} />
          )}
        </div>
      </div>
    </section>
  )
}

// Component for testimonial card
function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
      </div>
      <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
      <p className="font-semibold text-gray-900">- {testimonial.name}</p>
    </div>
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

// Component for footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FarmStay</h3>
            <p className="text-gray-400">Discover the best farmhouses and BnBs for your perfect getaway.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Properties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Farmhouses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bed & Breakfast</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400">Email: info@farmstay.com</p>
            <p className="text-gray-400">Phone: +91 9999999999</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FarmStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main homepage component that renders all sections
function HomePage() {
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
          <FarmhouseCarousel title="Popular Farmhouses in Jaipur" properties={POPULAR_FARMHOUSES} />
        </div>
        <FarmhouseCarousel title="Popular BnB in Jaipur" properties={POPULAR_BNBS} />
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