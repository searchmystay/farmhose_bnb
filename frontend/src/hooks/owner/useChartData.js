const useChartData = (dashboardData) => {
  const formatLineChartData = () => {
    if (!dashboardData?.daily_leads_last_7_days || !dashboardData?.day_labels) {
      return []
    }

    const chartData = dashboardData.day_labels.map((day, index) => ({
      day: day,
      leads: dashboardData.daily_leads_last_7_days[index] || 0,
    }))

    return chartData
  }

  const formatBarChartData = () => {
    if (!dashboardData?.daily_views_last_7_days || !dashboardData?.daily_leads_last_7_days || !dashboardData?.day_labels) {
      return []
    }

    const chartData = dashboardData.day_labels.map((day, index) => ({
      day: day,
      views: dashboardData.daily_views_last_7_days[index] || 0,
      leads: dashboardData.daily_leads_last_7_days[index] || 0,
    }))

    return chartData
  }

  return {
    lineChartData: formatLineChartData(),
    barChartData: formatBarChartData(),
  }
}

export default useChartData
