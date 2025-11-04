from datetime import datetime, timedelta
from bson import ObjectId
from ..database import db
from ..utils.exception_handler import handle_exceptions


@handle_exceptions
def get_last_complete_month_string():
    now = datetime.utcnow()
    first_day_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day_previous_month = first_day_current_month - timedelta(days=1)
    month_string = last_day_previous_month.strftime("%Y-%m")
    return month_string


@handle_exceptions
def get_all_farmhouses():
    farmhouses = list(db["farmhouse_analysis"].find({}))
    return farmhouses


@handle_exceptions
def filter_monthly_data(daily_data, month):
    month_data = [d for d in daily_data if d.get("date", "").startswith(month)]
    return month_data


@handle_exceptions
def calculate_monthly_totals(month_data):
    total_leads = sum(d.get("leads", 0) for d in month_data)
    total_views = sum(d.get("views", 0) for d in month_data)
    return total_leads, total_views


@handle_exceptions
def create_monthly_summary(month, total_leads, total_views):
    summary = {
        "month": month,
        "total_leads": total_leads,
        "total_views": total_views,
        "created_at": datetime.utcnow()
    }
    return summary


@handle_exceptions
def save_to_monthly_summary(farmhouse_id, summary):
    result = db["farmhouse_analysis"].update_one(
        {"_id": farmhouse_id},
        {"$set": {"monthly_summary": [summary]}}
    )
    return result.modified_count > 0


@handle_exceptions
def delete_monthly_daily_data(farmhouse_id, month):
    result = db["farmhouse_analysis"].update_one(
        {"_id": farmhouse_id},
        {"$pull": {"daily": {"date": {"$regex": f"^{month}"}}}}
    )
    return result.modified_count > 0


@handle_exceptions
def process_farmhouse_aggregation(farmhouse_doc, month):
    daily_data = farmhouse_doc.get("daily", [])
    month_data = filter_monthly_data(daily_data, month)
    
    if not month_data:
        return False
    
    total_leads, total_views = calculate_monthly_totals(month_data)
    summary = create_monthly_summary(month, total_leads, total_views)
    
    farmhouse_id = farmhouse_doc["_id"]
    save_to_monthly_summary(farmhouse_id, summary)
    delete_monthly_daily_data(farmhouse_id, month)
    
    return True


@handle_exceptions
def run_monthly_aggregation():
    month = get_last_complete_month_string()
    farmhouses = get_all_farmhouses()
    
    success_count = 0
    for farmhouse in farmhouses:
        result = process_farmhouse_aggregation(farmhouse, month)
        if result:
            success_count += 1
    
    return success_count
