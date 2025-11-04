from src.database.db_owner_analysis_operations import get_total_visits, get_total_contacts, get_contacts_last_7_days, get_contacts_last_month, get_contacts_last_year, get_daily_leads_last_7_days, get_daily_views_last_7_days, get_this_month_leads, get_last_month_leads, get_this_month_views, get_last_month_views
from src.database.db_payment_operations import get_farmhouse_credit_balance
from src.database.db_common_operations import db_find_many, db_aggregate, db_find_one, db_update_one
from src.utils.exception_handler import handle_exceptions, AppException
from bson import ObjectId
from datetime import datetime, timedelta
import pytz


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
def get_total_spend_money(farmhouse_id):
    total_leads = get_total_contacts(farmhouse_id)
    total_spend_money = total_leads * 40
    return total_spend_money


@handle_exceptions
def get_this_month_money_spend(farmhouse_id):
    this_month_leads = get_this_month_leads(farmhouse_id)
    this_month_money_spend = this_month_leads * 40
    return this_month_money_spend


@handle_exceptions
def generate_custom_farmhouse_id(mongodb_id):
    short_id = str(mongodb_id)[-6:].upper()
    custom_id = f"FH-{short_id}"
    return custom_id


@handle_exceptions
def get_dashboard_kpis(farmhouse_id):
    this_month_money_spend = get_this_month_money_spend(farmhouse_id)
    this_month_leads = get_this_month_leads(farmhouse_id)
    last_month_leads = get_last_month_leads(farmhouse_id)
    this_month_views = get_this_month_views(farmhouse_id)
    last_month_views = get_last_month_views(farmhouse_id)
    leads_last_7_days = get_contacts_last_7_days(farmhouse_id)
    
    total_money_spent = get_total_spend_money(farmhouse_id)
    total_leads = get_total_contacts(farmhouse_id)
    total_views = get_total_visits(farmhouse_id)
    total_rating = 0
    
    total_cost_given = get_total_cost_given(farmhouse_id)
    total_cost_left = get_farmhouse_credit_balance(farmhouse_id)
    
    farmhouse_doc = db_find_one("farmhouses", {"_id": ObjectId(farmhouse_id)})
    owner_name = farmhouse_doc.get("owner_details", {}).get("name", "N/A") if farmhouse_doc else "N/A"
    custom_farmhouse_id = generate_custom_farmhouse_id(farmhouse_id)
    
    kpis_data = {
        "row1_kpis": {
            "this_month_money_spend": this_month_money_spend,
            "this_month_leads": this_month_leads,
            "last_month_leads": last_month_leads,
            "this_month_views": this_month_views,
            "last_month_views": last_month_views,
            "leads_last_7_days": leads_last_7_days
        },
        "row2_kpis": {
            "total_money_spent": total_money_spent,
            "total_leads": total_leads,
            "total_views": total_views,
            "total_rating": total_rating
        },
        "payment_kpis": {
            "total_cost_given": total_cost_given,
            "total_cost_left": total_cost_left
        },
        "owner_info": {
            "name": owner_name,
            "farmhouse_id": custom_farmhouse_id
        }
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


# ============== BOOKED DATES MANAGEMENT ==============

@handle_exceptions
def get_booked_dates(farmhouse_id):
    """Get all booked dates for a farmhouse"""
    farmhouse = db_find_one("farmhouses", {"_id": ObjectId(farmhouse_id)})
    
    if not farmhouse:
        raise AppException("Farmhouse not found")
    
    booked_dates = farmhouse.get("booked_dates", [])
    
    # Convert datetime objects to ISO string format
    formatted_dates = []
    for date in booked_dates:
        if isinstance(date, datetime):
            formatted_dates.append(date.strftime("%Y-%m-%d"))
        else:
            formatted_dates.append(str(date))
    
    return {
        "booked_dates": formatted_dates
    }


@handle_exceptions
def add_booked_date(farmhouse_id, date_string):
    """Add a date to booked_dates array"""
    # Parse the date string (YYYY-MM-DD format)
    try:
        date_obj = datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise AppException("Invalid date format. Use YYYY-MM-DD")
    
    # Set time to start of day UTC
    date_obj = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Check if date is not in the past
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    if date_obj < today:
        raise AppException("Cannot book past dates")
    
    # Add to booked_dates array (use $addToSet to avoid duplicates)
    query_filter = {"_id": ObjectId(farmhouse_id)}
    update_data = {
        "$addToSet": {"booked_dates": date_obj}
    }
    
    result = db_update_one("farmhouses", query_filter, update_data)
    
    if not result:
        raise AppException("Failed to add booked date")
    
    return {
        "success": True,
        "message": "Date marked as booked",
        "date": date_string
    }


@handle_exceptions
def remove_booked_date(farmhouse_id, date_string):
    """Remove a date from booked_dates array"""
    # Parse the date string
    try:
        date_obj = datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise AppException("Invalid date format. Use YYYY-MM-DD")
    
    # Set time to start of day UTC
    date_obj = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Remove from booked_dates array
    query_filter = {"_id": ObjectId(farmhouse_id)}
    update_data = {
        "$pull": {"booked_dates": date_obj}
    }
    
    result = db_update_one("farmhouses", query_filter, update_data)
    
    if not result:
        raise AppException("Failed to remove booked date")
    
    return {
        "success": True,
        "message": "Date unmarked",
        "date": date_string
    }
