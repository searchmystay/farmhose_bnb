import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '▦' },
    { id: 'pending', name: 'Pending Properties', icon: '⋯' },
    { id: 'all', name: 'All Properties', icon: '⚏' },
    { id: 'settings', name: 'Settings', icon: '⚙' }
  ]

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId)
    setSidebarOpen(false) 
  }

  const renderSidebar = () => (
    <div className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:top-0 lg:h-screen`}>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
              activeTab === item.id 
                ? 'bg-green-50 text-green-700 border-r-3 border-green-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mr-3 w-5">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )

  const renderNavbar = () => (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded text-gray-500 hover:text-gray-700 mr-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Farmhouse Listing</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, Admin</span>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Properties</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">12</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">⋯</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved Properties</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">45</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected Properties</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">8</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">✕</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">128</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">👥</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'pending':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Pending Properties</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Pending properties list will be displayed here...</p>
            </div>
          </div>
        )
      
      case 'all':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">All Properties</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">All properties list will be displayed here...</p>
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Admin settings will be displayed here...</p>
            </div>
          </div>
        )
      
      default:
        return <div>Select a menu item</div>
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Farmhouse Listing</title>
        <meta name="description" content="Admin dashboard for managing farmhouse listings" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {renderNavbar()}
        
        <div className="pt-16 flex min-h-screen">
          {renderSidebar()}
          
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
                </h2>
              </div>
              
              {renderContent()}
            </div>
          </main>
        </div>
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </>
  )
}

export default AdminDashboard