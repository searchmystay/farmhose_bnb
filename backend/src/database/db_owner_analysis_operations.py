from bson import ObjectId
from datetime import datetime, timedelta
from . import db
from .db_common_operations import db_insert_one, db_count_documents, db_aggregate
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def record_visit(farmhouse_id):
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    
    collection.update_one(
        filter_dict,
        {
            "$inc": {"total_views": 1},
            "$set": {"updated_at": now},
            "$setOnInsert": {
                "farmhouse_id": ObjectId(farmhouse_id),
                "total_leads": 0,
                "daily": [],
                "created_at": now
            }
        },
        upsert=True
    )
    
    result = collection.update_one(
        {"farmhouse_id": ObjectId(farmhouse_id), "daily.date": today},
        {"$inc": {"daily.$.views": 1}}
    )
    
    if result.matched_count == 0:
        collection.update_one(
            filter_dict,
            {"$push": {"daily": {"date": today, "views": 1, "leads": 0}}}
        )
    
    return True


@handle_exceptions
def record_contact(farmhouse_id):
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    
    collection.update_one(
        filter_dict,
        {
            "$inc": {"total_leads": 1},
            "$set": {"updated_at": now},
            "$setOnInsert": {
                "farmhouse_id": ObjectId(farmhouse_id),
                "total_views": 0,
                "daily": [],
                "created_at": now
            }
        },
        upsert=True
    )
    
    result = collection.update_one(
        {"farmhouse_id": ObjectId(farmhouse_id), "daily.date": today},
        {"$inc": {"daily.$.leads": 1}}
    )
    
    if result.matched_count == 0:
        collection.update_one(
            filter_dict,
            {"$push": {"daily": {"date": today, "views": 0, "leads": 1}}}
        )
    
    return True


@handle_exceptions
def get_total_visits(farmhouse_id):
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    return doc.get("total_views", 0) if doc else 0


@handle_exceptions
def get_total_contacts(farmhouse_id):
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    return doc.get("total_leads", 0) if doc else 0


@handle_exceptions
def get_contacts_last_days(farmhouse_id, days):
    start_date = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    if not doc or "daily" not in doc:
        return 0
    
    total = sum(d.get("leads", 0) for d in doc.get("daily", []) if d.get("date", "") >= start_date)
    return total


@handle_exceptions
def get_contacts_last_7_days(farmhouse_id):
    count = get_contacts_last_days(farmhouse_id, 7)
    return count


@handle_exceptions
def get_contacts_last_month(farmhouse_id):
    count = get_contacts_last_days(farmhouse_id, 30)
    return count


@handle_exceptions
def get_contacts_last_year(farmhouse_id):
    count = get_contacts_last_days(farmhouse_id, 365)
    return count


@handle_exceptions
def get_daily_leads_last_7_days(farmhouse_id):
    start_date = datetime.utcnow() - timedelta(days=6)
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    daily_dict = {}
    if doc and "daily" in doc:
        for d in doc.get("daily", []):
            daily_dict[d.get("date", "")] = d.get("leads", 0)
    
    daily_data = []
    for i in range(7):
        date_str = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_data.append(daily_dict.get(date_str, 0))
    
    return daily_data


@handle_exceptions
def get_daily_views_last_7_days(farmhouse_id):
    start_date = datetime.utcnow() - timedelta(days=6)
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    daily_dict = {}
    if doc and "daily" in doc:
        for d in doc.get("daily", []):
            daily_dict[d.get("date", "")] = d.get("views", 0)
    
    daily_data = []
    for i in range(7):
        date_str = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_data.append(daily_dict.get(date_str, 0))
    
    return daily_data


@handle_exceptions
def get_this_month_leads(farmhouse_id):
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_start_str = month_start.strftime("%Y-%m-%d")
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    if not doc or "daily" not in doc:
        return 0
    
    total = sum(d.get("leads", 0) for d in doc.get("daily", []) if d.get("date", "") >= month_start_str)
    return total


@handle_exceptions
def get_last_month_string():
    now = datetime.utcnow()
    last_month_date = now.replace(day=1) - timedelta(days=1)
    last_month_str = last_month_date.strftime("%Y-%m")
    return last_month_str


@handle_exceptions
def find_month_in_summary(monthly_summary, month_str):
    for summary in monthly_summary:
        if summary.get("month") == month_str:
            return summary
    return None


@handle_exceptions
def get_last_month_leads(farmhouse_id):
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    if not doc:
        return 0
    
    last_month_str = get_last_month_string()
    monthly_summary = doc.get("monthly_summary", [])
    month_data = find_month_in_summary(monthly_summary, last_month_str)
    
    if month_data:
        total = month_data.get("total_leads", 0)
        return total
    
    now = datetime.utcnow()
    last_month_start = (now.replace(day=1) - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_end = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(microseconds=1)
    
    last_month_start_str = last_month_start.strftime("%Y-%m-%d")
    last_month_end_str = last_month_end.strftime("%Y-%m-%d")
    
    daily = doc.get("daily", [])
    total = sum(d.get("leads", 0) for d in daily 
                if last_month_start_str <= d.get("date", "") <= last_month_end_str)
    return total


@handle_exceptions
def get_this_month_views(farmhouse_id):
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_start_str = month_start.strftime("%Y-%m-%d")
    
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    if not doc or "daily" not in doc:
        return 0
    
    total = sum(d.get("views", 0) for d in doc.get("daily", []) if d.get("date", "") >= month_start_str)
    return total


@handle_exceptions
def get_last_month_views(farmhouse_id):
    collection = db["farmhouse_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    
    if not doc:
        return 0
    
    last_month_str = get_last_month_string()
    monthly_summary = doc.get("monthly_summary", [])
    month_data = find_month_in_summary(monthly_summary, last_month_str)
    
    if month_data:
        total = month_data.get("total_views", 0)
        return total
    
    now = datetime.utcnow()
    last_month_start = (now.replace(day=1) - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_end = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(microseconds=1)
    
    last_month_start_str = last_month_start.strftime("%Y-%m-%d")
    last_month_end_str = last_month_end.strftime("%Y-%m-%d")
    
    daily = doc.get("daily", [])
    total = sum(d.get("views", 0) for d in daily 
                if last_month_start_str <= d.get("date", "") <= last_month_end_str)
    return total
