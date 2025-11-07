import { useAnalytics } from '../../hooks/admin/useAnalytics'
import { CurrencyCircleDollar, TrendUp, Users, House, ChartBar, Wallet, Eye, CalendarPlus, UserPlus } from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function DashboardPage() {
  const { analytics, loading, error } = useAnalytics()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">Error loading analytics</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderKpiCard = (icon, title, value, color, subtitle = null) => {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-1 py-2 sm:p-6 cursor-pointer border border-gray-100">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          {subtitle && (
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-500">{subtitle}</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    )
  }

  const preparePlatformLeadsGraphData = () => {
    const graphData = analytics?.platform_leads_graph || []
    return graphData.map(item => ({
      month: item.month,
      leads: item.total_platform_leads
    }))
  }

  const prepareTop5ChartData = () => {
    const topProperties = analytics?.top_properties_last_month || []
    return topProperties.map(prop => ({
      name: prop.name.length > 15 ? prop.name.substring(0, 15) + '...' : prop.name,
      leads: prop.total_leads,
      views: prop.total_views
    }))
  }

  const renderPlatformLeadsGraph = () => {
    const chartData = preparePlatformLeadsGraphData()
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Users size={24} weight="duotone" className="text-purple-600 sm:w-7 sm:h-7" />
          <span className="text-sm sm:text-base md:text-xl">Platform Leads - Last 6 Months</span>
        </h2>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-50 rounded-lg">
              <p className="text-xs sm:text-sm text-purple-900 font-semibold">Monthly trend of platform leads</p>
              <p className="text-[10px] sm:text-xs text-purple-700 mt-1">Last 6 months data including current month (live)</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <Users size={48} className="mx-auto mb-3 text-gray-400" />
              <p>No data available</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderTop5Chart = () => {
    const chartData = prepareTop5ChartData()
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <ChartBar size={24} weight="duotone" className="text-orange-600 sm:w-7 sm:h-7" />
          <span className="text-sm sm:text-base md:text-xl">Top 5 Properties Last Month</span>
        </h2>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '9px' }} angle={-15} textAnchor="end" height={70} />
                <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} iconSize={12} />
                <Bar dataKey="leads" fill="#f97316" radius={[6, 6, 0, 0]} name="Leads" />
                <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-orange-50 rounded-lg">
              <p className="text-xs sm:text-sm text-orange-900 font-semibold">Based on leads generated in previous month</p>
              <p className="text-[10px] sm:text-xs text-orange-700 mt-1">Click tracking data</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <ChartBar size={48} className="mx-auto mb-3 text-gray-400" />
              <p>No data available for last month</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-0 py-6 sm:p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6 sm:mb-8">
        {renderKpiCard(
          <House size={40} weight="duotone" />,
          'Total Farmhouses',
          analytics?.property_counts?.total_farmhouses || 0,
          '#f59e0b'
        )}
        {renderKpiCard(
          <House size={40} weight="duotone" />,
          'Total BnBs',
          analytics?.property_counts?.total_bnbs || 0,
          '#8b5cf6'
        )}
        {renderKpiCard(
          <Wallet size={40} weight="duotone" />,
          'Total Money Left',
          formatCurrency(analytics?.total_money_left || 0),
          '#06b6d4',
          'Available credits balance'
        )}
        {renderKpiCard(
          <CurrencyCircleDollar size={40} weight="duotone" />,
          'Total Platform Revenue',
          formatCurrency(analytics?.revenue?.total_platform_revenue || 0),
          '#10b981',
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6 sm:mb-8">
        {renderKpiCard(
          <UserPlus size={40} weight="duotone" />,
          'This Month Leads',
          analytics?.current_month?.this_month_leads || 0,
          '#ec4899'
        )}
        {renderKpiCard(
          <Eye size={40} weight="duotone" />,
          'This Month Views',
          analytics?.current_month?.this_month_views || 0,
          '#14b8a6'
        )}
        {renderKpiCard(
          <TrendUp size={40} weight="duotone" />,
          'This Month Revenue',
          formatCurrency(analytics?.revenue?.this_month_revenue || 0),
          '#3b82f6',
          'Recharges in current month'
        )}
        {renderKpiCard(
          <CalendarPlus size={40} weight="duotone" />,
          'New Properties Added',
          analytics?.current_month?.new_properties_added || 0,
          '#f97316',
          'This month'
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {renderPlatformLeadsGraph()}
        {renderTop5Chart()}
      </div>
    </div>
  )
}

export default DashboardPage