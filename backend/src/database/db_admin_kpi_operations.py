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
    filter_dict = {"_id": "admin_analysis_singleton"}
    result = db_find_one("admin_analysis", filter_dict)
    
    if result and "last_month_top_properties" in result:
        top_properties = result["last_month_top_properties"][:limit]
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
        {"$unwind": "$daily_analytics"},
        {"$match": {"daily_analytics.date": {"$gte": month_start_str, "$lte": month_end_str}}},
        {"$group": {
            "_id": "$farmhouse_id",
            "monthly_leads": {"$sum": "$daily_analytics.leads"},
            "monthly_views": {"$sum": "$daily_analytics.views"}
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
def upsert_admin_analysis(month_str, top_properties, total_leads, total_views, new_properties):
    month_entry = {
        "month": month_str,
        "total_platform_leads": total_leads,
        "total_platform_views": total_views,
        "new_properties_added": new_properties
    }
    
    top_props_formatted = []
    for prop in top_properties:
        formatted_prop = {
            "farmhouse_id": str(prop["farmhouse_id"]) if isinstance(prop["farmhouse_id"], ObjectId) else prop["farmhouse_id"],
            "name": prop["name"],
            "total_leads": prop["total_leads"],
            "total_views": prop["total_views"]
        }
        top_props_formatted.append(formatted_prop)
    
    existing = db.admin_analysis.find_one({"_id": "admin_analysis_singleton"})
    
    if existing:
        monthly_data = existing.get("monthly_data", [])
        month_exists = any(m["month"] == month_str for m in monthly_data)
        
        if not month_exists:
            db.admin_analysis.update_one(
                {"_id": "admin_analysis_singleton"},
                {
                    "$push": {"monthly_data": month_entry},
                    "$set": {
                        "last_month_top_properties": top_props_formatted,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        else:
            db.admin_analysis.update_one(
                {"_id": "admin_analysis_singleton"},
                {
                    "$set": {
                        "last_month_top_properties": top_props_formatted,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
    else:
        new_doc = {
            "_id": "admin_analysis_singleton",
            "monthly_data": [month_entry],
            "last_month_top_properties": top_props_formatted,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        db_insert_one("admin_analysis", new_doc)
    
    return True


@handle_exceptions
def save_monthly_admin_analysis(month_str):
    month_data = parse_month_string(month_str)
    date_range = calculate_month_range(month_data["year"], month_data["month"])
    
    results = aggregate_top_properties_for_month(date_range["start"], date_range["end"])
    top_properties = enrich_with_property_names(results)
    
    total_leads = aggregate_platform_leads_for_month(date_range["start"], date_range["end"])
    total_views = aggregate_platform_views_for_month(date_range["start"], date_range["end"])
    new_properties = count_new_properties_for_month(date_range["start"], date_range["end"])
    
    upsert_admin_analysis(month_str, top_properties, total_leads, total_views, new_properties)
    return True


@handle_exceptions
def get_current_month_string():
    now = datetime.utcnow()
    month_str = f"{now.year}-{now.month:02d}"
    return month_str


@handle_exceptions
def get_current_month_dates():
    now = datetime.utcnow()
    start_date = f"{now.year}-{now.month:02d}-01"
    end_date = f"{now.year}-{now.month:02d}-{now.day:02d}"
    date_range = {"start": start_date, "end": end_date}
    return date_range


@handle_exceptions
def aggregate_platform_leads_for_month(start_date, end_date):
    pipeline = [
        {"$unwind": "$daily_analytics"},
        {"$match": {"daily_analytics.date": {"$gte": start_date, "$lte": end_date}}},
        {"$group": {"_id": None, "total_leads": {"$sum": "$daily_analytics.leads"}}}
    ]
    result = list(db.farmhouse_analysis.aggregate(pipeline))
    total_leads = result[0]["total_leads"] if result else 0
    return total_leads


@handle_exceptions
def aggregate_platform_views_for_month(start_date, end_date):
    pipeline = [
        {"$unwind": "$daily_analytics"},
        {"$match": {"daily_analytics.date": {"$gte": start_date, "$lte": end_date}}},
        {"$group": {"_id": None, "total_views": {"$sum": "$daily_analytics.views"}}}
    ]
    result = list(db.farmhouse_analysis.aggregate(pipeline))
    total_views = result[0]["total_views"] if result else 0
    return total_views


@handle_exceptions
def count_new_properties_for_month(start_date, end_date):
    start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
    end_datetime = datetime.strptime(end_date, "%Y-%m-%d")
    end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
    
    filter_dict = {"created_at": {"$gte": start_datetime, "$lte": end_datetime}}
    count = db.farmhouses.count_documents(filter_dict)
    return count


@handle_exceptions
def get_current_month_stats_live():
    month_str = get_current_month_string()
    date_range = get_current_month_dates()
    
    total_leads = aggregate_platform_leads_for_month(date_range["start"], date_range["end"])
    total_views = aggregate_platform_views_for_month(date_range["start"], date_range["end"])
    new_properties = count_new_properties_for_month(date_range["start"], date_range["end"])
    
    stats = {
        "month": month_str,
        "total_platform_leads": total_leads,
        "total_platform_views": total_views,
        "new_properties_added": new_properties
    }
    return stats


@handle_exceptions
def get_last_5_saved_months():
    filter_dict = {"_id": "admin_analysis_singleton"}
    projection = {"monthly_data": {"$slice": -5}, "_id": 0}
    result = db.admin_analysis.find_one(filter_dict, projection)
    
    if result and "monthly_data" in result:
        monthly_data = result["monthly_data"]
        return monthly_data
    
    empty_list = []
    return empty_list


@handle_exceptions
def get_total_money_left():
    total_credits = aggregate_total_credits()
    return total_credits
