import { Helmet } from 'react-helmet-async'

// Mock data constants - replace with API calls later
const POPULAR_FARMHOUSES = [
  { id: 1, name: "Sunset Villa", location: "Jaipur", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop", price: "₹3,500" },
  { id: 2, name: "Green Valley Farm", location: "Jaipur", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=300&h=200&fit=crop", price: "₹2,800" },
  { id: 3, name: "Royal Heritage", location: "Jaipur", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300&h=200&fit=crop", price: "₹4,200" },
  { id: 4, name: "Peaceful Retreat", location: "Jaipur", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop", price: "₹3,000" },
  { id: 5, name: "Mountain View", location: "Jaipur", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop", price: "₹3,800" }
]

const POPULAR_BNBS = [
  { id: 1, name: "Cozy Corner BnB", location: "Jaipur", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop", price: "₹1,800" },
  { id: 2, name: "Heritage House", location: "Jaipur", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop", price: "₹2,200" },
  { id: 3, name: "Garden View BnB", location: "Jaipur", image: "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=300&h=200&fit=crop", price: "₹1,500" },
  { id: 4, name: "City Center Stay", location: "Jaipur", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop", price: "₹2,000" },
  { id: 5, name: "Traditional BnB", location: "Jaipur", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop", price: "₹1,700" }
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

// Component for property card display
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

// Component for scrollable property section
function PropertySection({ title, properties }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
          {properties.map(property => <PropertyCard key={property.id} property={property} />)}
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
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Guests Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(testimonial => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
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
        <PropertySection title="Popular Farmhouses in Jaipur" properties={POPULAR_FARMHOUSES} />
        <PropertySection title="Popular BnB in Jaipur" properties={POPULAR_BNBS} />
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