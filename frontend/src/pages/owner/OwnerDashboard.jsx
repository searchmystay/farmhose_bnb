import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { CurrencyCircleDollar, TrendUp, Eye, Users, CalendarBlank, ChartBar, House, CreditCard, Gear, Copy, Check } from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { toast } from 'sonner'
import useOwnerDashboard from '../../hooks/owner/useOwnerDashboard'
import useChartData from '../../hooks/owner/useChartData'
import useRazorpay from '../../hooks/owner/useRazorpay'
import useBookedDates from '../../hooks/owner/useBookedDates'
import Logo from '/search_my_stay_logo.svg'
import '../../styles/calender.css'

function OwnerDashboard() {
  const { farmhouseId } = useParams()
  const { dashboardData, loading, error, refetchData } = useOwnerDashboard(farmhouseId)
  const { lineChartData, barChartData } = useChartData(dashboardData)
  const { bookedDates, addBookedDate, removeBookedDate, loading: calendarLoading } = useBookedDates(farmhouseId)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Credits added to your account.')
    setRechargeAmount('')
    setActiveTab('dashboard')
    refetchData()
  }

  const { initiatePayment, loading: paymentLoading } = useRazorpay(farmhouseId, handlePaymentSuccess)

  const handleCopyReviewLink = async () => {
    const reviewUrl = 'https://mystate.xyz'
    try {
      await navigator.clipboard.writeText(reviewUrl)
      setCopied(true)
      toast.success('Review link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const renderKpiCard = (icon, title, value, color, lastMonthValue = null, reviewLink = null) => {
    return (
      <div 
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer border border-gray-100"
      >
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          {lastMonthValue !== null && (
            <div className="text-right">
              <p className="text-gray-700 font-semibold text-base">{lastMonthValue}</p>
              <p className="text-xs text-gray-400">vs last month</p>
            </div>
          )}
          {reviewLink && (
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-600 block mb-2">Review Link:</span>
              <button
                onClick={handleCopyReviewLink}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-xs font-medium border border-blue-200"
              >
                {copied ? (
                  <>
                    <Check size={14} weight="bold" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
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

  const renderLineChart = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <TrendUp size={28} weight="duotone" className="text-blue-600" />
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
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <ChartBar size={28} weight="duotone" className="text-blue-600" />
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
    const row1Kpis = kpis.row1_kpis || {}
    const row2Kpis = kpis.row2_kpis || {}
    const paymentKpis = kpis.payment_kpis || {}
    const ownerInfo = kpis.owner_info || {}

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md border-b-2 border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button - Mobile Only */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle menu"
            >
              <span className="w-6 h-0.5 bg-black block"></span>
              <span className="w-6 h-0.5 bg-black block"></span>
              <span className="w-6 h-0.5 bg-black block"></span>
            </button>
            <img src={Logo} alt="Company Logo" className="h-8 sm:h-10" style={{ filter: 'brightness(0)' }}/>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="text-right">
              <span className="text-black font-bold hidden sm:inline">Owner: </span>
              <span className="font-semibold text-gray-900">{ownerInfo.name || 'N/A'}</span>
            </div>
            <div className="text-right">
              <span className="text-black font-bold">Credits Left: </span>
              <span className="font-semibold text-green-600">₹{paymentKpis.total_cost_left || 0}</span>
            </div>
          </div>
        </header>

        <div className="flex relative">
          {/* Sidebar */}
          <aside 
            className={`bg-white shadow-2xl min-h-screen transition-all duration-300 z-50
              ${mobileMenuOpen ? 'fixed md:relative left-0 top-0 w-64' : 'hidden md:block'}
              md:min-h-[calc(100vh-72px)] md:${sidebarExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            {/* Close button for mobile */}
            {mobileMenuOpen && (
              <div className="md:hidden flex justify-between items-center p-4 border-b">
                <span className="font-semibold text-gray-900">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4">
              <nav className="space-y-3">
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Dashboard"
                >
                  <House size={24} weight={activeTab === 'dashboard' ? 'fill' : 'regular'} />
                  <span className="md:hidden lg:inline">{mobileMenuOpen || sidebarExpanded ? 'Dashboard' : ''}</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('recharge')
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'recharge' 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Recharge Credits"
                >
                  <CreditCard size={24} weight={activeTab === 'recharge' ? 'fill' : 'regular'} />
                  <span className="md:hidden lg:inline">{mobileMenuOpen || sidebarExpanded ? 'Recharge Credits' : ''}</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTab('settings')
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Settings"
                >
                  <Gear size={24} weight={activeTab === 'settings' ? 'fill' : 'regular'} />
                  <span className="md:hidden lg:inline">{mobileMenuOpen || sidebarExpanded ? 'Settings' : ''}</span>
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1 bg-gray-50">
            {activeTab === 'dashboard' && (
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {renderKpiCard(
                    <CurrencyCircleDollar size={40} weight="duotone" />, 
                    'This Month Money Spend', 
                    `₹${row1Kpis.this_month_money_spend || 0}`, 
                    '#ef4444',
                    null
                  )}
                  {renderKpiCard(
                    <Users size={40} weight="duotone" />, 
                    'This Month Leads', 
                    row1Kpis.this_month_leads || 0, 
                    '#8b5cf6',
                    row1Kpis.last_month_leads || 0
                  )}
                  {renderKpiCard(
                    <Eye size={40} weight="duotone" />, 
                    'This Month Views', 
                    row1Kpis.this_month_views || 0, 
                    '#f59e0b',
                    row1Kpis.last_month_views || 0
                  )}
                  {renderKpiCard(
                    <CalendarBlank size={40} weight="duotone" />, 
                    'Last 7 Days Lead', 
                    row1Kpis.leads_last_7_days || 0, 
                    '#06b6d4',
                    null
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {renderKpiCard(
                    <CurrencyCircleDollar size={40} weight="duotone" />, 
                    'Total Money Spent', 
                    `₹${paymentKpis.total_cost_given || 0}`, 
                    '#dc2626',
                    null
                  )}
                  {renderKpiCard(
                    <Users size={40} weight="duotone" />, 
                    'Total Lead', 
                    row2Kpis.total_leads || 0, 
                    '#10b981',
                    null
                  )}
                  {renderKpiCard(
                    <Eye size={40} weight="duotone" />, 
                    'Total Views', 
                    row2Kpis.total_views || 0, 
                    '#3b82f6',
                    null
                  )}
                  {renderKpiCard(
                    <TrendUp size={40} weight="duotone" />, 
                    'Total Rating out of 5', 
                    row2Kpis.review_average || 0, 
                    '#f59e0b',
                    null,
                    true
                  )}
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderLineChart()}
                  {renderBarChart()}
                </div>
              </div>
            )}

           {activeTab === 'recharge' && (
             <div className="flex items-center justify-center min-h-[80vh] p-10">
                <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-3xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CreditCard size={32} weight="duotone" className="text-blue-600" />
                    Recharge Credits
                  </h2>
                  
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        disabled={paymentLoading}
                        min="1"
                        step="1"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        ₹40 per lead. Enter the amount you want to recharge.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-600 font-medium mb-1">Current Balance</p>
                          <p className="text-2xl font-bold text-blue-900">₹{paymentKpis.total_cost_left || 0}</p>
                        </div>
                        {rechargeAmount && parseFloat(rechargeAmount) > 0 && (
                          <div>
                            <p className="text-sm text-green-600 font-medium mb-1">After Recharge</p>
                            <p className="text-2xl font-bold text-green-900">₹{(paymentKpis.total_cost_left || 0) + parseFloat(rechargeAmount)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-6 lg:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2">
                      <CalendarBlank size={24} weight="duotone" className="text-blue-600 sm:hidden" />
                      <CalendarBlank size={28} weight="duotone" className="text-blue-600 hidden sm:block md:hidden" />
                      <CalendarBlank size={32} weight="duotone" className="text-blue-600 hidden md:block" />
                      <span>Booking Calendar</span>
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm">Click on dates to mark them as booked. Drag across multiple dates to book a range. Past dates are disabled.</p>
                  </div>

                  {calendarLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="fullcalendar-wrapper">
                      <FullCalendar
                        key={bookedDates.join(',')}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                          left: 'prev,next today',
                          center: 'title',
                          right: 'dayGridMonth'
                        }}
                        height="auto"
                        contentHeight="auto"
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={false}
                        weekends={true}
                        events={[]}
                        fixedWeekCount={false}
                        select={async (info) => {
                          // Handle date range selection (drag-to-select)
                          const startDate = new Date(info.startStr)
                          const endDate = new Date(info.endStr)
                          
                          // Get today's date
                          const today = new Date()
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                          
                          // Generate array of dates in the selected range
                          const datesToBook = []
                          const currentDate = new Date(startDate)
                          
                          while (currentDate < endDate) {
                            const year = currentDate.getFullYear()
                            const month = String(currentDate.getMonth() + 1).padStart(2, '0')
                            const day = String(currentDate.getDate()).padStart(2, '0')
                            const dateStr = `${year}-${month}-${day}`
                            
                            // Only add future/today dates
                            if (dateStr >= todayStr) {
                              datesToBook.push(dateStr)
                            }
                            
                            currentDate.setDate(currentDate.getDate() + 1)
                          }
                          
                          if (datesToBook.length === 0) {
                            toast.error('Cannot book past dates')
                            return
                          }
                          
                          // Check if all dates are booked (for unbooking)
                          const allBooked = datesToBook.every(date => bookedDates.includes(date))
                          
                          if (allBooked) {
                            // Unbook all dates in range
                            for (const dateStr of datesToBook) {
                              await removeBookedDate(dateStr)
                            }
                            toast.success(`${datesToBook.length} date(s) unbooked`)
                          } else {
                            // Book all dates that aren't already booked
                            let bookedCount = 0
                            for (const dateStr of datesToBook) {
                              if (!bookedDates.includes(dateStr)) {
                                await addBookedDate(dateStr)
                                bookedCount++
                              }
                            }
                            if (bookedCount > 0) {
                              toast.success(`${bookedCount} date(s) booked`)
                            }
                          }
                        }}
                        dateClick={async (info) => {
                          // Use the exact date string from info.dateStr (already in YYYY-MM-DD format)
                          const clickedDateStr = info.dateStr
                          
                          // Compare with today using string format
                          const today = new Date()
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                          
                          // Prevent booking past dates
                          if (clickedDateStr < todayStr) {
                            toast.error('Cannot book past dates')
                            return
                          }
                          
                          // Check if date is already booked
                          const isBooked = bookedDates.includes(clickedDateStr)
                          
                          if (isBooked) {
                            // Unbook the date
                            await removeBookedDate(clickedDateStr)
                          } else {
                            // Book the date
                            await addBookedDate(clickedDateStr)
                          }
                        }}
                        dayCellClassNames={(arg) => {
                          // Format date without timezone conversion
                          const year = arg.date.getFullYear()
                          const month = String(arg.date.getMonth() + 1).padStart(2, '0')
                          const day = String(arg.date.getDate()).padStart(2, '0')
                          const dateStr = `${year}-${month}-${day}`
                          
                          // Compare with today
                          const today = new Date()
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                          
                          const classes = []
                          
                          // Past dates
                          if (dateStr < todayStr) {
                            classes.push('fc-past-date')
                          }
                          // Booked dates
                          else if (bookedDates.includes(dateStr)) {
                            classes.push('fc-booked-date')
                          }
                          // Available dates
                          else {
                            classes.push('fc-available-date')
                          }
                          
                          return classes
                        }}
                        dayCellContent={(arg) => {
                          // Format date without timezone conversion - SAME as above
                          const year = arg.date.getFullYear()
                          const month = String(arg.date.getMonth() + 1).padStart(2, '0')
                          const day = String(arg.date.getDate()).padStart(2, '0')
                          const dateStr = `${year}-${month}-${day}`
                          
                          const isBooked = bookedDates.includes(dateStr)
                          
                          return (
                            <div className="fc-daygrid-day-frame">
                              <div className="fc-daygrid-day-top">
                                <a className="fc-daygrid-day-number">{arg.dayNumberText}</a>
                              </div>
                              {isBooked && (
                                <div className="fc-booked-label">
                                  <span>🔒 Booked</span>
                                </div>
                              )}
                            </div>
                          )
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm calendar-legend">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-200"></div>
                      <span className="text-gray-600">Past Dates (Disabled)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-200"></div>
                      <span className="text-gray-600">Booked Dates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
                      <span className="text-gray-600">Available Dates</span>
                    </div>
                  </div>
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
    </>
  )
}

export default OwnerDashboard
