from bson import ObjectId
from datetime import datetime
import calendar
from . import db
from .db_common_operations import db_find_one, db_insert_one
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def aggregate_property_counts():
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ]
    results = list(db.farmhouses.aggregate(pipeline))
    return results


@handle_exceptions
def format_property_counts(results):
    counts = {"farmhouse": 0, "bnb": 0}
    for result in results:
        property_type = result["_id"]
        if property_type in counts:
            counts[property_type] = result["count"]
    return counts


@handle_exceptions
def get_property_counts_by_type():
    results = aggregate_property_counts()
    counts = format_property_counts(results)
    return counts


@handle_exceptions
def aggregate_total_payments():
    pipeline = [
        {"$match": {"status": "success"}},
        {"$group": {"_id": None, "total_recharged": {"$sum": "$amount"}}}
    ]
    result = list(db.payments.aggregate(pipeline))
    total_recharged = result[0]["total_recharged"] if result else 0
    return total_recharged


@handle_exceptions
def aggregate_total_credits():
    pipeline = [
        {"$group": {"_id": None, "total_credits_left": {"$sum": "$credit_balance"}}}
    ]
    result = list(db.farmhouses.aggregate(pipeline))
    total_credits_left = result[0]["total_credits_left"] if result else 0
    return total_credits_left


@handle_exceptions
def calculate_platform_revenue(total_leads, total_recharged, total_credits_left):
    per_lead_cost = 40
    total_revenue = total_leads * per_lead_cost
    revenue_data = {
        "total_revenue": total_revenue,
        "total_recharged": total_recharged,
        "credits_left": total_credits_left
    }
    return revenue_data


@handle_exceptions
def get_total_platform_revenue():
    total_leads = aggregate_total_leads()
    total_recharged = aggregate_total_payments()
    total_credits_left = aggregate_total_credits()
    revenue_data = calculate_platform_revenue(total_leads, total_recharged, total_credits_left)
    return revenue_data


@handle_exceptions
def get_current_month_start():
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    return month_start


@handle_exceptions
def aggregate_monthly_payments(month_start):
    pipeline = [
        {"$match": {"status": "success", "created_at": {"$gte": month_start}}},
        {"$group": {"_id": None, "monthly_revenue": {"$sum": "$amount"}}}
    ]
    result = list(db.payments.aggregate(pipeline))
    monthly_revenue = result[0]["monthly_revenue"] if result else 0
    return monthly_revenue


@handle_exceptions
def get_this_month_revenue():
    month_start = get_current_month_start()
    monthly_revenue = aggregate_monthly_payments(month_start)
    return monthly_revenue


@handle_exceptions
def aggregate_total_leads():
    pipeline = [
        {"$group": {"_id": None, "total_leads": {"$sum": "$total_leads"}}}
    ]
    result = list(db.farmhouse_analysis.aggregate(pipeline))
    total_leads = result[0]["total_leads"] if result else 0
    return total_leads


@handle_exceptions
def get_total_leads():
    total_leads = aggregate_total_leads()
    return total_leads


@handle_exceptions
def get_last_month_string():
    now = datetime.utcnow()
    if now.month == 1:
        last_month = 12
        last_year = now.year - 1
    else:
        last_month = now.month - 1
        last_year = now.year
    month_str = f"{last_year}-{last_month:02d}"
    return month_str


@handle_exceptions
def get_top_properties_last_month(limit):
    month_str = get_last_month_string()
    filter_dict = {"month": month_str}
    result = db_find_one("trending_properties", filter_dict)
    
    if result and "top_properties" in result:
        top_properties = result["top_properties"][:limit]
        for prop in top_properties:
            if "farmhouse_id" in prop and isinstance(prop["farmhouse_id"], ObjectId):
                prop["farmhouse_id"] = str(prop["farmhouse_id"])
        return top_properties
    
    empty_list = []
    return empty_list


@handle_exceptions
def parse_month_string(month_str):
    year, month = map(int, month_str.split('-'))
    month_data = {"year": year, "month": month}
    return month_data


@handle_exceptions
def calculate_month_range(year, month):
    month_start_str = f"{year}-{month:02d}-01"
    last_day = calendar.monthrange(year, month)[1]
    month_end_str = f"{year}-{month:02d}-{last_day:02d}"
    date_range = {"start": month_start_str, "end": month_end_str}
    return date_range


@handle_exceptions
def aggregate_top_properties_for_month(month_start_str, month_end_str):
    pipeline = [
        {"$unwind": "$daily"},
        {"$match": {"daily.date": {"$gte": month_start_str, "$lte": month_end_str}}},
        {"$group": {
            "_id": "$farmhouse_id",
            "monthly_leads": {"$sum": "$daily.leads"},
            "monthly_views": {"$sum": "$daily.views"}
        }},
        {"$sort": {"monthly_leads": -1}},
        {"$limit": 5}
    ]
    results = list(db.farmhouse_analysis.aggregate(pipeline))
    return results


@handle_exceptions
def enrich_with_property_names(results):
    enriched_properties = []
    
    for result in results:
        farmhouse_id = result["_id"]
        filter_dict = {"_id": farmhouse_id}
        property_data = db_find_one("farmhouses", filter_dict)
        
        if property_data:
            property_info = {
                "farmhouse_id": str(farmhouse_id),
                "name": property_data.get("name", "Unknown"),
                "type": property_data.get("type", "farmhouse"),
                "total_leads": result["monthly_leads"],
                "total_views": result["monthly_views"]
            }
            enriched_properties.append(property_info)
    
    return enriched_properties


@handle_exceptions
def save_to_collection(month_str, top_properties):
    monthly_summary = {
        "month": month_str,
        "top_properties": top_properties,
        "created_at": datetime.utcnow()
    }
    
    existing = db_find_one("trending_properties", {"month": month_str})
    
    if existing:
        db.trending_properties.update_one(
            {"month": month_str},
            {"$set": monthly_summary}
        )
    else:
        db_insert_one("trending_properties", monthly_summary)
    
    return True


@handle_exceptions
def save_monthly_top_properties(month_str):
    month_data = parse_month_string(month_str)
    date_range = calculate_month_range(month_data["year"], month_data["month"])
    results = aggregate_top_properties_for_month(date_range["start"], date_range["end"])
    top_properties = enrich_with_property_names(results)
    save_to_collection(month_str, top_properties)
    return top_properties
