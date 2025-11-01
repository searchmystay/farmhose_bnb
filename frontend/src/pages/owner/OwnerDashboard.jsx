import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { CurrencyCircleDollar, TrendUp, Eye, Users, CalendarBlank, ChartBar } from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useOwnerDashboard from '../../hooks/owner/useOwnerDashboard'
import useChartData from '../../hooks/owner/useChartData'

function OwnerDashboard() {
  const { farmhouseId } = useParams()
  const { dashboardData, loading, error, refetchData } = useOwnerDashboard(farmhouseId)
  const { lineChartData, barChartData } = useChartData(dashboardData)

  const renderKpiCard = (icon, title, value, color) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
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

    return (
      <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Owner Panel</h2>
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Razorpay
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="bg-white shadow-sm border-b">
            <div className="px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            </div>
          </header>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {renderKpiCard(<CurrencyCircleDollar size={40} weight="duotone" />, 'Total Cost Left', `₹${kpis.total_cost_left || 0}`, '#10b981')}
              {renderKpiCard(<CurrencyCircleDollar size={40} weight="duotone" />, 'Total Cost Given', `₹${kpis.total_cost_given || 0}`, '#3b82f6')}
              {renderKpiCard(<Users size={40} weight="duotone" />, 'Total Leads', kpis.total_leads || 0, '#8b5cf6')}
              {renderKpiCard(<Eye size={40} weight="duotone" />, 'Total Views', kpis.total_views || 0, '#f59e0b')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {renderKpiCard(<CalendarBlank size={40} weight="duotone" />, 'Leads Last 7 Days', kpis.total_leads_last_7_days || 0, '#ef4444')}
              {renderKpiCard(<CalendarBlank size={40} weight="duotone" />, 'Leads Last Month', kpis.total_leads_last_month || 0, '#06b6d4')}
              {renderKpiCard(<CalendarBlank size={40} weight="duotone" />, 'Leads Last Year', kpis.total_leads_last_year || 0, '#ec4899')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderLineChart()}
              {renderBarChart()}
            </div>
          </div>
        </main>
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
    </>
  )
}

export default OwnerDashboard
