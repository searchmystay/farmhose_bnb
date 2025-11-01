from bson import ObjectId
from datetime import datetime, timedelta
from . import db
from .db_common_operations import db_insert_one, db_count_documents
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def record_visit(farmhouse_id):
    visit_data = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "type": "visited",
        "created_at": datetime.utcnow()
    }
    
    result = db_insert_one("owner_analysis", visit_data)
    return True


@handle_exceptions
def record_contact(farmhouse_id):
    contact_data = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "type": "contacted",
        "created_at": datetime.utcnow()
    }
    
    result = db_insert_one("owner_analysis", contact_data)
    return True


@handle_exceptions
def get_total_visits(farmhouse_id):
    filter_dict = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "type": "visited"
    }
    
    total_count = db_count_documents("owner_analysis", filter_dict)
    return total_count


@handle_exceptions
def get_total_contacts(farmhouse_id):
    filter_dict = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "type": "contacted"
    }
    
    total_count = db_count_documents("owner_analysis", filter_dict)
    return total_count


@handle_exceptions
def get_contacts_last_days(farmhouse_id, days):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    filter_dict = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "type": "contacted",
        "created_at": {"$gte": start_date}
    }
    
    count = db_count_documents("owner_analysis", filter_dict)
    return count


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
