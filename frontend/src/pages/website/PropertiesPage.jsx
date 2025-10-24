import { Helmet } from 'react-helmet-async'

function PropertiesPage() {
  return (
    <>
      <Helmet>
        <title>Browse Farmhouses & BnB Properties | Find Your Perfect Stay</title>
        <meta name="description" content="Browse our collection of premium farmhouses and bed & breakfast properties. Filter by location, amenities, and price to find your ideal getaway." />
        <meta name="keywords" content="farmhouse listings, bnb properties, vacation rentals, farm stay search" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Browse Properties
          </h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text" 
                placeholder="Search by location..." 
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Property Type</option>
                <option>Farmhouse</option>
                <option>Bed & Breakfast</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Price Range</option>
                <option>Under ₹2000</option>
                <option>₹2000 - ₹5000</option>
                <option>Above ₹5000</option>
              </select>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Card Template */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Property Name</h3>
                <p className="text-gray-600 text-sm mb-3">Location details</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">₹2,500/night</span>
                  <button className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PropertiesPage