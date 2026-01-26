from bson import ObjectId
from datetime import datetime
from src.database.db_common_operations import db_update_one, db_find_one
from src.utils.exception_handler import handle_exceptions, AppException
from src.logics.cloudfare_bucket import overwrite_image_in_r2, overwrite_document_in_r2
from src.logics.website_logic import *


FIELD_MAPPING = {
    "owner_name": "owner_details.owner_name",
    "owner_photo": "owner_details.owner_photo",
    "owner_dashboard_id": "owner_details.owner_dashboard_id",
    "owner_dashboard_password": "owner_details.owner_dashboard_password",
    "owner_description": "owner_details.owner_description",
    "property_name": "name",
    "opening_time": "opening_time",
    "closing_time": "closing_time",
    "per_day_cost": "per_day_price",
    "description": "description",
    "max_people_allowed": "max_people_allowed",
    "max_children_allowed": "max_children_allowed",
    "max_pets_allowed": "max_pets_allowed",
    "aadhar_card": "documents.aadhar_card",
    "pan_card": "documents.pan_card",
    "property_document": "documents.property_docs"
}


@handle_exceptions
def validate_owner_photo(value):
    if not value or not isinstance(value, str):
        raise AppException("Owner photo data is required and must be a string", 400)
    
    if not value.startswith('data:image/jpeg'):
        raise AppException("Owner photo must be a valid JPEG base64 string", 400)
    
    return value


@handle_exceptions
def validate_document_base64(value):
    if not value or not isinstance(value, str):
        raise AppException("Document data is required and must be a string", 400)
    
    if not value.startswith('data:application/pdf'):
        raise AppException("Document must be a valid PDF base64 string", 400)
    
    return value


@handle_exceptions
def validate_field_value(field_name, value, property_id=None):
    match field_name:
        case "owner_name":
            validate_name_max_words(value, 3, "Owner name")
            return value 
        
        case "owner_photo":
            validated_value = validate_owner_photo(value)
            return validated_value
        
        case "owner_description":
            validate_description_length(value)
            return value 
        
        case "owner_dashboard_password":
            validate_strong_password(value)
            return value
        
        case "owner_dashboard_id":
            existing_property = db_find_one("farmhouses", {"_id": ObjectId(property_id)})
            current_dashboard_id = existing_property.get("owner_details", {}).get("owner_dashboard_id")
            
            if value != current_dashboard_id:
                check_dashboard_id_unique(value)
            
            return value
        
        case "property_name":
            validate_name_max_words(value, 3, "Property name")
            return value
        
        case "opening_time":
            validated_time = validate_time_format(value, "Opening time")
            return validated_time
        
        case "closing_time":
            validated_time = validate_time_format(value, "Closing time")
            return validated_time
        
        case "per_day_cost":
            validated_cost = validate_per_day_cost(value)
            return validated_cost
        
        case "description":
            validate_description_length(value)
            return value
        
        case "max_people_allowed":
            validated_capacity = validate_max_capacity(value, "Max adults", 1, 50)
            return validated_capacity
        
        case "max_children_allowed":
            validated_capacity = validate_max_capacity(value, "Max children", 0, 20)
            return validated_capacity
        
        case "max_pets_allowed":
            validated_capacity = validate_max_capacity(value, "Max pets", 0, 10)
            return validated_capacity
        
        case "aadhar_card" | "pan_card" | "property_document":
            validated_value = validate_document_base64(value)
            return validated_value
        
        case _:
            raise AppException(f"Field '{field_name}' is not supported for editing", 400)


@handle_exceptions
def check_property_exists(property_id):
    filter_dict = {"_id": ObjectId(property_id)}
    property_data = db_find_one("farmhouses", filter_dict)
    
    if not property_data:
        raise AppException("Property not found", 404)
    
    return True


@handle_exceptions
def get_current_photo_url(property_id):
    filter_dict = {"_id": ObjectId(property_id)}
    property_data = db_find_one("farmhouses", filter_dict)
    
    if not property_data:
        raise AppException("Property not found", 404)
    
    owner_photo_url = property_data.get("owner_details", {}).get("owner_photo")
    
    if not owner_photo_url:
        raise AppException("Owner photo URL not found in database", 404)
    
    return owner_photo_url


@handle_exceptions
def handle_owner_photo_upload(property_id, base64_string):
    existing_photo_url = get_current_photo_url(property_id)
    updated_url = overwrite_image_in_r2(base64_string, existing_photo_url)
    return updated_url


@handle_exceptions
def get_current_document_url(property_id, doc_field):
    filter_dict = {"_id": ObjectId(property_id)}
    property_data = db_find_one("farmhouses", filter_dict)
    
    if not property_data:
        raise AppException("Property not found", 404)
    
    documents = property_data.get("documents", {})
    
    if doc_field == "aadhar_card":
        doc_url = documents.get("aadhar_card")
    elif doc_field == "pan_card":
        doc_url = documents.get("pan_card")
    elif doc_field == "property_document":
        property_docs = documents.get("property_docs", [])
        if not property_docs or len(property_docs) == 0:
            raise AppException("No property document found to replace", 404)
        doc_url = property_docs[0]
    else:
        raise AppException("Invalid document field", 400)
    
    if not doc_url:
        raise AppException(f"{doc_field.replace('_', ' ').title()} URL not found in database", 404)
    
    return doc_url


@handle_exceptions
def handle_document_upload(property_id, doc_field, base64_string):
    existing_doc_url = get_current_document_url(property_id, doc_field)
    updated_url = overwrite_document_in_r2(base64_string, existing_doc_url)
    return updated_url


@handle_exceptions
def update_property_field_in_db(property_id, db_field_path, validated_value):
    filter_dict = {"_id": ObjectId(property_id)}
    update_dict = {
        "$set": {
            db_field_path: validated_value,
            "updated_at": datetime.now()
        }
    }
    
    update_result = db_update_one("farmhouses", filter_dict, update_dict)
    
    if update_result.modified_count == 0:
        raise AppException("Failed to update property field", 500)
    
    return True


@handle_exceptions
def update_property_field(property_id, field_name, value):
    if field_name not in FIELD_MAPPING:
        raise AppException(f"Invalid field name: {field_name}", 400)
    
    try:
        object_id = ObjectId(property_id)
    except Exception:
        raise AppException("Invalid property ID format", 400)
    
    check_property_exists(property_id)
    validated_value = validate_field_value(field_name, value, property_id)
    
    if field_name == "owner_photo":
        photo_url = handle_owner_photo_upload(property_id, validated_value)
        validated_value = photo_url
    
    if field_name in ["aadhar_card", "pan_card", "property_document"]:
        doc_url = handle_document_upload(property_id, field_name, validated_value)
        validated_value = doc_url
    
    db_field_path = FIELD_MAPPING[field_name]
    update_property_field_in_db(property_id, db_field_path, validated_value)
    
    return True
