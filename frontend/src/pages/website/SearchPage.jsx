import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'

function SearchPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    propertyType: 'both',
    numberOfPeople: 'flexible'
  })

  useEffect(() => {
    const savedSearchData = sessionStorage.getItem('searchCriteria')
    if (savedSearchData) {
      const parsedData = JSON.parse(savedSearchData)
      setFormData({
        checkIn: parsedData.checkIn || '',
        checkOut: parsedData.checkOut || '',
        propertyType: parsedData.propertyType || 'both',
        numberOfPeople: parsedData.numberOfPeople || 'flexible'
      })
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const searchData = {
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      propertyType: formData.propertyType,
      numberOfPeople: formData.numberOfPeople === 'flexible' ? 'flexible' : parseInt(formData.numberOfPeople)
    }
    
    sessionStorage.setItem('searchCriteria', JSON.stringify(searchData))
    console.log('Search data saved to session storage:', searchData)
    
    if (formData.propertyType === 'farmhouse') {
      navigate('/farmhouse')
    } else if (formData.propertyType === 'bnb') {
      navigate('/bnb')
    } else {
      navigate('/farmhouse')
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const renderHeader = () => (
    <div className="bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <img src="/search_my_stay_logo.svg" alt="Search My Stay" className="h-6 md:h-8 w-auto" style={{ filter: 'brightness(0)' }} />
          </div>
          <button onClick={() => navigate('/wishlist')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </button>
        </div>
      </div>
    </div>
  )

  const renderPageTitle = () => (
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h1>
      <p className="text-base md:text-lg text-gray-600 leading-relaxed">Search through our curated collection of farmhouses and BnBs to find your ideal getaway</p>
    </div>
  )

  const renderPropertyTypeSelection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">What are you looking for?</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { value: 'farmhouse', label: 'Farmhouse', icon: '🏡' },
          { value: 'bnb', label: 'Bed & Breakfast', icon: '🏠' },
          { value: 'both', label: 'Both', icon: '🌟' }
        ].map((option) => (
          <label key={option.value} className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.propertyType === option.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
            <input type="radio" name="propertyType" value={option.value} checked={formData.propertyType === option.value} onChange={handleInputChange} className="sr-only" />
            <span className="text-xl md:text-2xl mr-2 md:mr-3">{option.icon}</span>
            <span className="font-medium text-sm md:text-base">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderDateSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
        <input type="date" id="checkIn" name="checkIn" value={formData.checkIn} onChange={handleInputChange} min={getTodayDate()} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200" />
      </div>
      <div>
        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
        <input type="date" id="checkOut" name="checkOut" value={formData.checkOut} onChange={handleInputChange} min={formData.checkIn || getTomorrowDate()} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200" />
      </div>
    </div>
  )

  const renderNumberOfPeople = () => (
    <div>
      <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
      <select id="numberOfPeople" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200">
        <option value="flexible">Flexible</option>
        {[...Array(20)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} {i + 1 === 1 ? 'Person' : 'People'}
          </option>
        ))}
      </select>
    </div>
  )

  const renderQuickTips = () => (
    <div className="mt-8 bg-blue-50 rounded-xl p-4 md:p-6">
      <h3 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
      <ul className="space-y-2 text-blue-800 text-sm">
        <li>• Book in advance for better availability and rates</li>
        <li>• Check property amenities to match your needs</li>
        <li>• Contact hosts directly for special requests</li>
      </ul>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Search Properties | Find Your Perfect Stay</title>
        <meta name="description" content="Search and book premium farmhouses and bed & breakfast accommodations. Find your perfect stay with our advanced search filters." />
        <meta name="keywords" content="search farmhouse, search BnB, property search, accommodation finder" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        
        <main className="container mx-auto px-4 py-6 md:py-12">
          <div className="max-w-2xl mx-auto">
            {renderPageTitle()}
            
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderPropertyTypeSelection()}
                {renderDateSelection()}
                {renderNumberOfPeople()}
                
                <div className="pt-4">
                  <button type="submit" className="w-full bg-green-600 text-white py-3 md:py-4 px-6 rounded-lg font-medium text-base md:text-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-[1.02]">
                    Search Properties
                  </button>
                </div>
              </form>
            </div>

            {renderQuickTips()}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default SearchPage