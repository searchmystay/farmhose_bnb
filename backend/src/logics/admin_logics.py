from src.logics.admin_auth import authenticate_super_admin
from src.utils.exception_handler import handle_exceptions, AppException
from src.database.db_common_operations import db_find_many, db_find_one, db_update_one, db_delete_one
from src.logics.website_logic import process_property_for_detail, extract_all_amenities, build_complete_address
from src.logics.cloudfare_bucket import delete_farmhouse_folder_from_r2
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
def process_admin_property_details(property_data):
    property_id = str(property_data.get("_id"))
    name = property_data.get("name", "")
    full_description = property_data.get("description", "")
    images = property_data.get("images", [])
    amenities_data = property_data.get("amenities", [])
    location_data = property_data.get("location", {})
    documents = property_data.get("documents", [])
    whatsapp_link = property_data.get("whatsapp_link", "")
    property_type = property_data.get("type", "")
    
    all_amenities = extract_all_amenities(amenities_data)
    complete_address = build_complete_address(location_data)
    
    processed_data = {
        "id": property_id,
        "name": name,
        "description": full_description,
        "type": property_type,
        "images": images,
        "amenities": all_amenities,
        "address": complete_address,
        "documents": documents,
        "whatsapp_link": whatsapp_link
    }
    
    return processed_data


@handle_exceptions
def get_pending_property_details(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1,
        "documents": 1,
        "whatsapp_link": 1,
        "type": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Pending property not found")
    
    processed_property = process_admin_property_details(property_data)
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


@handle_exceptions
def reject_pending_property(property_id):
    query_filter = {"_id": ObjectId(property_id), "status": "pending_approval"}
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1})
    
    if not property_exists:
        raise AppException("Pending property not found")
    
    delete_farmhouse_folder_from_r2(property_id)
    db_delete_one("farmhouses", query_filter)
    return True


@handle_exceptions
def add_credit_balance(property_id, credit_amount):
    query_filter = {"_id": ObjectId(property_id)}
    
    property_exists = db_find_one("farmhouses", query_filter, {"_id": 1, "credit_balance": 1})
    
    if not property_exists:
        raise AppException("Property not found")
    
    current_balance = property_exists.get("credit_balance", 0)
    new_balance = current_balance + credit_amount
    
    update_data = {"credit_balance": new_balance}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return True