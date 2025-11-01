from src.database.db_owner_analysis_operations import get_total_visits, get_total_contacts, get_contacts_last_7_days, get_contacts_last_month, get_contacts_last_year, get_daily_leads_last_7_days, get_daily_views_last_7_days
from src.database.db_payment_operations import get_farmhouse_credit_balance
from src.database.db_common_operations import db_find_many, db_aggregate
from src.utils.exception_handler import handle_exceptions, AppException
from bson import ObjectId
from datetime import datetime, timedelta


@handle_exceptions
def get_total_cost_given(farmhouse_id):
    pipeline = [
        {
            "$match": {
                "farmhouse_id": ObjectId(farmhouse_id),
                "status": "success"
            }
        },
        {
            "$group": {
                "_id": None,
                "total": {"$sum": "$amount"}
            }
        }
    ]
    
    result = db_aggregate("payments", pipeline)
    
    if result and len(result) > 0:
        total_amount = result[0].get("total", 0)
    else:
        total_amount = 0
    
    return total_amount


@handle_exceptions
def get_dashboard_kpis(farmhouse_id):
    total_cost_left = get_farmhouse_credit_balance(farmhouse_id)
    total_cost_given = get_total_cost_given(farmhouse_id)
    total_leads = get_total_contacts(farmhouse_id)
    total_leads_last_7_days = get_contacts_last_7_days(farmhouse_id)
    total_leads_last_month = get_contacts_last_month(farmhouse_id)
    total_leads_last_year = get_contacts_last_year(farmhouse_id)
    total_views = get_total_visits(farmhouse_id)
    
    kpis_data = {
        "total_cost_left": total_cost_left,
        "total_cost_given": total_cost_given,
        "total_leads": total_leads,
        "total_leads_last_7_days": total_leads_last_7_days,
        "total_leads_last_month": total_leads_last_month,
        "total_leads_last_year": total_leads_last_year,
        "total_views": total_views
    }
    
    return kpis_data


@handle_exceptions
def get_leads_vs_views_graph(farmhouse_id):
    total_views = get_total_visits(farmhouse_id)
    total_leads = get_total_contacts(farmhouse_id)
    
    graph_data = {
        "total_views": total_views,
        "total_leads": total_leads
    }
    
    return graph_data


@handle_exceptions
def get_day_labels_last_7_days():
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    labels = []
    today = datetime.utcnow()
    
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        day_index = date.weekday()
        labels.append(day_names[day_index])
    
    return labels


@handle_exceptions
def get_owner_dashboard_data(farmhouse_id):
    kpis = get_dashboard_kpis(farmhouse_id)
    graph = get_leads_vs_views_graph(farmhouse_id)
    daily_leads = get_daily_leads_last_7_days(farmhouse_id)
    daily_views = get_daily_views_last_7_days(farmhouse_id)
    day_labels = get_day_labels_last_7_days()
    
    dashboard_data = {
        "kpis": kpis,
        "leads_vs_views_graph": graph,
        "daily_leads_last_7_days": daily_leads,
        "daily_views_last_7_days": daily_views,
        "day_labels": day_labels
    }
    
    return dashboard_data
