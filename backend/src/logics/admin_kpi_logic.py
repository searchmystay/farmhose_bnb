from ..database.db_admin_kpi_operations import (
    get_property_counts_by_type,
    get_total_platform_revenue,
    get_this_month_revenue,
    get_total_leads,
    get_top_properties_last_month,
    get_total_money_left,
    get_current_month_stats_live,
    get_last_6_months_data
)
from ..utils.exception_handler import handle_exceptions


@handle_exceptions
def build_property_counts_data(property_counts):
    counts_data = {
        "total_farmhouses": property_counts["farmhouse"],
        "total_bnbs": property_counts["bnb"]
    }
    return counts_data


@handle_exceptions
def build_revenue_data(revenue_info, monthly_revenue):
    revenue_data = {
        "total_platform_revenue": revenue_info["total_revenue"],
        "this_month_revenue": monthly_revenue,
        "total_recharged": revenue_info["total_recharged"],
        "credits_left": revenue_info["credits_left"]
    }
    return revenue_data


@handle_exceptions
def build_engagement_data(total_leads):
    engagement_data = {
        "total_leads": total_leads
    }
    return engagement_data


@handle_exceptions
def build_current_month_data(current_month_stats):
    month_data = {
        "this_month_leads": current_month_stats["total_platform_leads"],
        "this_month_views": current_month_stats["total_platform_views"],
        "new_properties_added": current_month_stats["new_properties_added"]
    }
    return month_data


@handle_exceptions
def build_kpis_response(counts_data, revenue_data, engagement_data, top_properties, current_month, graph_data, total_money):
    kpis = {
        "property_counts": counts_data,
        "revenue": revenue_data,
        "engagement": engagement_data,
        "top_properties_last_month": top_properties,
        "current_month": current_month,
        "platform_leads_graph": graph_data,
        "total_money_left": total_money
    }
    return kpis


@handle_exceptions
def get_admin_dashboard_kpis():
    property_counts = get_property_counts_by_type()
    revenue_info = get_total_platform_revenue()
    monthly_revenue = get_this_month_revenue()
    total_leads = get_total_leads()
    top_properties = get_top_properties_last_month(limit=5)
    total_money = get_total_money_left()
    current_month_stats = get_current_month_stats_live()
    graph_data = get_last_6_months_data()
    
    counts_data = build_property_counts_data(property_counts)
    revenue_data = build_revenue_data(revenue_info, monthly_revenue)
    engagement_data = build_engagement_data(total_leads)
    current_month = build_current_month_data(current_month_stats)
    kpis = build_kpis_response(counts_data, revenue_data, engagement_data, top_properties, current_month, graph_data, total_money)
    
    return kpis
