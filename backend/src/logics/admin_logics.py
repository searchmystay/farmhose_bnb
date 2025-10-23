from src.logics.admin_auth import authenticate_super_admin
from src.utils.exception_handler import handle_exceptions, AppException
from src.database.db_common_operations import db_find_many, db_find_one, db_update_one
from src.logics.website_logic import process_property_for_detail
from bson import ObjectId


@handle_exceptions
def process_admin_login(login_data):
    password = login_data.get("password")
    
    if not password:
        raise AppException("Password is required")
    
    auth_result = authenticate_super_admin(password)
    
    login_response = {
        "message": "Login successful",
        "token": auth_result.get("token"),
        "expires_in": auth_result.get("expires_in"),
        "superadmin": auth_result.get("superadmin")
    }
    
    return login_response


@handle_exceptions
def get_pending_properties():
    query_filter = {"status": "pending_approval"}
    projection = {
        "_id": 1,
        "name": 1,
        "type": 1,
        "created_at": 1
    }
    
    pending_properties = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in pending_properties:
        processed_property = {
            "id": str(property_data.get("_id")),
            "name": property_data.get("name", ""),
            "type": property_data.get("type", ""),
            "created_at": property_data.get("created_at")
        }
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions
def get_pending_property_details(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Pending property not found")
    
    processed_property = process_property_for_detail(property_data)
    return processed_property


@handle_exceptions
def approve_pending_property(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Pending property not found")
    
    update_data = {"status": "active"}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return True