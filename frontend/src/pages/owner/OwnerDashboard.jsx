import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { CurrencyCircleDollar, TrendUp, Eye, Users, CalendarBlank, ChartBar, X } from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import useOwnerDashboard from '../../hooks/owner/useOwnerDashboard'
import useChartData from '../../hooks/owner/useChartData'
import useRazorpay from '../../hooks/owner/useRazorpay'
import Logo from '../../assets/icons/logo.svg'

function OwnerDashboard() {
  const { farmhouseId } = useParams()
  const { dashboardData, loading, error, refetchData } = useOwnerDashboard(farmhouseId)
  const { lineChartData, barChartData } = useChartData(dashboardData)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Credits added to your account.')
    setShowPaymentModal(false)
    setRechargeAmount('')
    refetchData()
  }

  const { initiatePayment, loading: paymentLoading } = useRazorpay(farmhouseId, handlePaymentSuccess)

  const renderKpiCard = (icon, title, value, color, subtitle = null) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>
          <div className="text-4xl opacity-20" style={{ color }}>{icon}</div>
        </div>
      </div>
    )
  }

  const renderLineChart = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendUp size={24} weight="duotone" className="text-blue-600" />
          Total Leads Last 7 Days
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderBarChart = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ChartBar size={24} weight="duotone" className="text-blue-600" />
          Leads vs Views Comparison (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="leads" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const handleRechargeSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(rechargeAmount)
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    initiatePayment(amount)
  }

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recharge Credits</h3>
            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleRechargeSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={paymentLoading}
                min="1"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-2">
                ₹40 per lead. Enter amount you want to recharge.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Current Balance:</span> ₹{dashboardData?.kpis?.payment_info?.total_cost_left || 0}
              </p>
              {rechargeAmount && parseFloat(rechargeAmount) > 0 && (
                <p className="text-sm text-blue-800 mt-2">
                  <span className="font-semibold">After Recharge:</span> ₹{(dashboardData?.kpis?.payment_info?.total_cost_left || 0) + parseFloat(rechargeAmount)}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                disabled={paymentLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : 'Proceed to Pay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderLoadingState = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const renderErrorState = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">Error loading dashboard</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={refetchData} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const renderDashboardContent = () => {
    const kpis = dashboardData?.kpis || {}
    const paymentInfo = kpis.payment_info || {}
    const mainKpis = kpis.main_kpis || {}
    const ownerInfo = kpis.owner_info || {}

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Company Logo" className="h-8" style={{ filter: 'brightness(0)' }} />
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-right">
              <span className="text-gray-500">Owner: </span>
              <span className="font-semibold text-gray-900">{ownerInfo.name || 'N/A'}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500">ID: </span>
              <span className="font-semibold text-gray-700">{ownerInfo.farmhouse_id || 'N/A'}</span>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-56px)]">
            <div className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full text-left px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Recharge Credits
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {renderKpiCard(
                    <CurrencyCircleDollar size={40} weight="duotone" />, 
                    'Total Money Spend', 
                    `₹${mainKpis.total_spend_money || 0}`, 
                    '#ef4444'
                  )}
                  {renderKpiCard(
                    <CalendarBlank size={40} weight="duotone" />, 
                    'This Month Leads', 
                    mainKpis.this_month_leads || 0, 
                    '#8b5cf6',
                    `Last Month: ${mainKpis.last_month_leads || 0}`
                  )}
                  {renderKpiCard(
                    <Eye size={40} weight="duotone" />, 
                    'This Month Views', 
                    mainKpis.this_month_views || 0, 
                    '#f59e0b',
                    `Last Month: ${mainKpis.last_month_views || 0}`
                  )}
                  {renderKpiCard(
                    <Users size={40} weight="duotone" />, 
                    'Overall Total Leads', 
                    mainKpis.total_leads_overall || 0, 
                    '#10b981'
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {renderKpiCard(
                    <CurrencyCircleDollar size={40} weight="duotone" />, 
                    'Total Cost Given', 
                    `₹${paymentInfo.total_cost_given || 0}`, 
                    '#3b82f6'
                  )}
                  {renderKpiCard(
                    <CurrencyCircleDollar size={40} weight="duotone" />, 
                    'Total Cost Left', 
                    `₹${paymentInfo.total_cost_left || 0}`, 
                    '#10b981'
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderLineChart()}
                  {renderBarChart()}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600">Settings page - Coming soon!</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Owner Dashboard | Farmhouse Management</title>
        <meta name="description" content="Manage your farmhouse analytics, leads, and credits" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {loading && renderLoadingState()}
      {error && !loading && renderErrorState()}
      {!loading && !error && dashboardData && renderDashboardContent()}
      {renderPaymentModal()}
    </>
  )
}

export default OwnerDashboard
