import { useAnalytics } from '../../hooks/admin/useAnalytics'
import { CurrencyCircleDollar, TrendUp, Users, House, ChartBar } from '@phosphor-icons/react'
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
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          {subtitle && (
            <div className="text-right">
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    )
  }

  const prepareLeadsChartData = () => {
    const totalLeads = analytics?.engagement?.total_leads || 0
    return [
      { name: 'Total Platform Leads', leads: totalLeads }
    ]
  }

  const prepareTop5ChartData = () => {
    const topProperties = analytics?.top_properties_last_month || []
    return topProperties.map(prop => ({
      name: prop.name.length > 15 ? prop.name.substring(0, 15) + '...' : prop.name,
      leads: prop.total_leads,
      views: prop.total_views
    }))
  }

  const renderLeadsChart = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Users size={28} weight="duotone" className="text-purple-600" />
          Total Platform Leads
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prepareLeadsChartData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="leads" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-900 font-semibold">Total Leads: {analytics?.engagement?.total_leads || 0}</p>
          <p className="text-xs text-purple-700 mt-1">Across all properties on the platform</p>
        </div>
      </div>
    )
  }

  const renderTop5Chart = () => {
    const chartData = prepareTop5ChartData()
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <ChartBar size={28} weight="duotone" className="text-orange-600" />
          Top 5 Properties Last Month
        </h2>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="leads" fill="#f97316" radius={[8, 8, 0, 0]} name="Leads" />
                <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-900 font-semibold">Based on leads generated in previous month</p>
              <p className="text-xs text-orange-700 mt-1">Click tracking data</p>
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
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {renderKpiCard(
          <CurrencyCircleDollar size={40} weight="duotone" />,
          'Total Platform Revenue',
          formatCurrency(analytics?.revenue?.total_platform_revenue || 0),
          '#10b981',
          `From leads consumed (${analytics?.engagement?.total_leads || 0} leads × ₹40)`
        )}
        {renderKpiCard(
          <TrendUp size={40} weight="duotone" />,
          'This Month Revenue',
          formatCurrency(analytics?.revenue?.this_month_revenue || 0),
          '#3b82f6',
          'Recharges in current month'
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderLeadsChart()}
        {renderTop5Chart()}
      </div>
    </div>
  )
}

export default DashboardPage