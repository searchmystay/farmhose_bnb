from src.database.db_owner_analysis_operations import get_total_visits, get_total_contacts, get_contacts_last_7_days, get_contacts_last_month, get_contacts_last_year, get_daily_leads_last_7_days, get_daily_views_last_7_days, get_this_month_leads, get_last_month_leads, get_this_month_views, get_last_month_views
from src.database.db_payment_operations import get_farmhouse_credit_balance
from src.database.db_common_operations import db_find_many, db_aggregate, db_find_one, db_update_one
from src.utils.exception_handler import handle_exceptions, AppException
from src.config import JWT_SECRET_KEY
from bson import ObjectId
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import pytz
import jwt


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


@handle_exceptions
def get_booked_dates(farmhouse_id):
    farmhouse = db_find_one("farmhouses", {"_id": ObjectId(farmhouse_id)})
    
    if not farmhouse:
        raise AppException("Farmhouse not found")
    
    booked_dates = farmhouse.get("booked_dates", [])
    
    return {
        "booked_dates": booked_dates
    }


@handle_exceptions
def add_booked_date(farmhouse_id, date_string):
    # Parse the date string (YYYY-MM-DD format)
    try:
        date_obj = datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise AppException("Invalid date format. Use YYYY-MM-DD")
    
    # Check if date is not in the past
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    if date_obj < today:
        raise AppException("Cannot book past dates")
    
    # Add to booked_dates array as string (use $addToSet to avoid duplicates)
    query_filter = {"_id": ObjectId(farmhouse_id)}
    update_data = {
        "$addToSet": {"booked_dates": date_string}
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
    # Validate the date string
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise AppException("Invalid date format. Use YYYY-MM-DD")
    
    # Remove from booked_dates array as string
    query_filter = {"_id": ObjectId(farmhouse_id)}
    update_data = {
        "$pull": {"booked_dates": date_string}
    }
    
    result = db_update_one("farmhouses", query_filter, update_data)
    
    if not result:
        raise AppException("Failed to remove booked date")
    
    return {
        "success": True,
        "message": "Date unmarked",
        "date": date_string
    }


@handle_exceptions
def validate_owner_credentials(owner_id, password):
    query = {"owner_details.owner_dashboard_id": owner_id}
    projection = {"_id": 1, "owner_details": 1, "name": 1}
    owner = db_find_one("farmhouses", query, projection)
    
    if not owner:
        raise AppException("Invalid owner ID or password")
    
    owner_details = owner.get("owner_details", {})
    stored_password = owner_details.get("owner_dashboard_password")
    
    if not stored_password or stored_password != password:
        raise AppException("Invalid owner ID or password")
    
    return owner


@handle_exceptions
def generate_owner_jwt_token(farmhouse_id, owner_id):
    if not JWT_SECRET_KEY:
        raise AppException("JWT secret not configured")
    
    payload = {
        "farmhouse_id": str(farmhouse_id),
        "owner_id": owner_id,
        "owner": True,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token


@handle_exceptions
def verify_owner_jwt_token(token):
    if not JWT_SECRET_KEY:
        raise AppException("JWT secret not configured")
    
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        
        if not payload.get('owner'):
            raise AppException("Invalid owner token")
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise AppException("Token has expired")
    except jwt.InvalidTokenError:
        raise AppException("Invalid token")


@handle_exceptions
def authenticate_owner(owner_id, password):
    owner = validate_owner_credentials(owner_id, password)
    farmhouse_id = owner["_id"]
    owner_details = owner.get("owner_details", {})
    owner_token = generate_owner_jwt_token(farmhouse_id, owner_id)
    
    auth_result = {
        "token": owner_token,
        "farmhouse_id": str(farmhouse_id),
        "farmhouse_name": owner.get("name"),
        "owner_name": owner_details.get("owner_name"),
        "expires_in": 24 * 60 * 60,
        "owner": True
    }
    
    return auth_result


def owner_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('owner_token')
        
        if not token:
            return jsonify({
                "success": False,
                "message": "Authentication required"
            }), 401
        
        try:
            payload = verify_owner_jwt_token(token)
            request.owner = payload
            return f(*args, **kwargs)
            
        except AppException as e:
            return jsonify({
                "success": False,
                "message": str(e)
            }), 401
    
    return decorated_function
