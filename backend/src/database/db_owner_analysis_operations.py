from bson import ObjectId
from datetime import datetime, timedelta
from . import db
from .db_common_operations import db_insert_one, db_count_documents, db_aggregate
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def record_visit(farmhouse_id):
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")
    
    collection = db["owner_analysis"]
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
    
    collection = db["owner_analysis"]
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
    collection = db["owner_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    return doc.get("total_views", 0) if doc else 0


@handle_exceptions
def get_total_contacts(farmhouse_id):
    collection = db["owner_analysis"]
    filter_dict = {"farmhouse_id": ObjectId(farmhouse_id)}
    doc = collection.find_one(filter_dict)
    return doc.get("total_leads", 0) if doc else 0


@handle_exceptions
def get_contacts_last_days(farmhouse_id, days):
    start_date = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    
    collection = db["owner_analysis"]
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
    
    collection = db["owner_analysis"]
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
    
    collection = db["owner_analysis"]
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
