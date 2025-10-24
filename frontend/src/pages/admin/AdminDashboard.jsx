import { Helmet } from 'react-helmet-async'

function AdminDashboard() {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Property Management</title>
        <meta name="description" content="Admin dashboard for managing farmhouse and BnB properties, approvals, and credits." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
              <p className="text-3xl font-bold text-orange-600">12</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Active Properties</h3>
              <p className="text-3xl font-bold text-green-600">45</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-blue-600">₹2.5L</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
              <p className="text-3xl font-bold text-purple-600">8,450</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors">
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-semibold">View Pending</div>
                  <div className="text-sm opacity-90">Properties awaiting approval</div>
                </div>
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold">Add Credits</div>
                  <div className="text-sm opacity-90">Manage property credits</div>
                </div>
              </button>
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm opacity-90">Revenue and usage stats</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">New property submitted</p>
                  <p className="text-sm text-gray-500">Sunset Villa Farmhouse</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">Property approved</p>
                  <p className="text-sm text-gray-500">Mountain View BnB</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Credits added</p>
                  <p className="text-sm text-gray-500">₹500 to Green Valley Farm</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard