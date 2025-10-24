import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

// Dummy data for properties (same as HomePage but more properties)
const allProperties = [
  {
    id: 1,
    type: 'farmhouse',
    name: 'Sunset Valley Farmhouse',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    ],
    amenities: ['WiFi', 'Pool', 'Garden', 'Parking'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 2,
    type: 'farmhouse',
    name: 'Green Acres Retreat',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    ],
    amenities: ['WiFi', 'Kitchen', 'Garden', 'BBQ'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 3,
    type: 'farmhouse',
    name: 'Riverside Farm Stay',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    ],
    amenities: ['WiFi', 'River View', 'Fishing', 'Parking'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 4,
    type: 'farmhouse',
    name: 'Mountain View Farmhouse',
    images: [
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    ],
    amenities: ['WiFi', 'Mountain View', 'Garden', 'Parking'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 5,
    type: 'farmhouse',
    name: 'Organic Farm Estate',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
    ],
    amenities: ['WiFi', 'Organic Garden', 'Wine Tour', 'Kitchen'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 6,
    type: 'bnb',
    name: 'Cozy Hill Station BnB',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
      'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    ],
    amenities: ['WiFi', 'Breakfast', 'Balcony', 'AC'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 7,
    type: 'bnb',
    name: 'Heritage BnB Villa',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1615874694520-474822394e73?w=400',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    ],
    amenities: ['WiFi', 'Breakfast', 'Beach Access', 'Parking'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 8,
    type: 'bnb',
    name: 'Modern BnB Retreat',
    images: [
      'https://images.unsplash.com/photo-1520637736862-4d197d17c88a?w=400',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400'
    ],
    amenities: ['WiFi', 'Breakfast', 'Gym', 'Spa'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 9,
    type: 'bnb',
    name: 'Lake View BnB',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'
    ],
    amenities: ['WiFi', 'Breakfast', 'Lake View', 'Boating'],
    guests: 4,
    bedrooms: 2,
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  },
  {
    id: 10,
    type: 'bnb',
    name: 'Boutique BnB Haven',
    images: [
      'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
    ],
    amenities: ['WiFi', 'Breakfast', 'Garden', 'Library'],
    description: 'Success doesn’t come overnight; it’s built through consistency, patience, and learning from failures. Every small step forward counts, even when progress feels slow.'
  }
]

// Simple SearchNavbar Component
const SearchNavbar = ({ 
  checkInDate = '',
  onCheckInChange,
  checkOutDate = '',
  onCheckOutChange,
  onSearch
}) => {
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-900">
            SearchMyStay
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => onCheckInChange?.(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                min={new Date().toISOString().split('T')[0]}
                placeholder="Check-in"
              />
            </div>
            <div>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => onCheckOutChange?.(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                min={checkInDate || new Date().toISOString().split('T')[0]}
                placeholder="Check-out"
              />
            </div>
            <button
              onClick={onSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// FarmhouseCard Component (exactly like HomePage)
const FarmhouseCard = ({ property }) => {
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-80 h-96 flex-shrink-0 overflow-hidden flex flex-col">
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

function PropertiesPage() {
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [filteredProperties, setFilteredProperties] = useState(allProperties)

  const handleSearch = () => {
    // Filter logic will be implemented here
    console.log('Searching with:', { searchLocation, checkInDate, checkOutDate })
  }

  const handleFilterClick = () => {
    console.log('Opening filters')
  }

  return (
    <>
      <Helmet>
        <title>Farmhouses & BnB Properties | Find Your Perfect Stay</title>
        <meta name="description" content="Browse our collection of premium farmhouses and bed & breakfast properties for your perfect getaway." />
        <meta name="keywords" content="farmhouse listings, bnb properties, vacation rentals, farm stay" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <SearchNavbar
          searchLocation={searchLocation}
          onSearchLocationChange={setSearchLocation}
          checkInDate={checkInDate}
          onCheckInChange={setCheckInDate}
          checkOutDate={checkOutDate}
          onCheckOutChange={setCheckOutDate}
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
          resultCount={filteredProperties.length}
        />

        {/* Properties Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {filteredProperties.map(property => (
                <FarmhouseCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PropertiesPage