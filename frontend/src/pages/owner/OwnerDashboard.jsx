import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { CurrencyCircleDollar, TrendUp, Eye, Users, CalendarBlank, ChartBar } from '@phosphor-icons/react'
import useOwnerDashboard from '../../hooks/owner/useOwnerDashboard'

function OwnerDashboard() {
  const { farmhouseId } = useParams()
  const { dashboardData, loading, error, refetchData } = useOwnerDashboard(farmhouseId)

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

  const renderGraph = () => {
    if (!dashboardData?.leads_vs_views_graph) return null

    const { total_views, total_leads } = dashboardData.leads_vs_views_graph
    const conversionRate = total_views > 0 ? ((total_leads / total_views) * 100).toFixed(1) : 0

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <ChartBar size={24} weight="duotone" className="text-blue-600" />
          Leads vs Views Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Eye size={32} weight="duotone" className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{total_views}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users size={32} weight="duotone" className="text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{total_leads}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendUp size={32} weight="duotone" className="text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{conversionRate}%</p>
          </div>
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

            {renderGraph()}
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
