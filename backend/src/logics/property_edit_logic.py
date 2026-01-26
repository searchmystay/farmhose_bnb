from bson import ObjectId
from datetime import datetime
from src.database.db_common_operations import db_update_one, db_find_one
from src.utils.exception_handler import handle_exceptions, AppException


FIELD_MAPPING = {
    "owner_name": "owner_details.owner_name",
    "owner_photo": "owner_details.owner_photo",
    "owner_dashboard_id": "owner_details.owner_dashboard_id",
    "owner_dashboard_password": "owner_details.owner_dashboard_password",
    "owner_description": "owner_details.owner_description"
}


@handle_exceptions
def validate_owner_name(value):
    if not value or not isinstance(value, str):
        raise AppException("Owner name is required and must be a string", 400)
    
    cleaned_value = value.strip()
    
    if len(cleaned_value) < 3:
        raise AppException("Owner name must be at least 3 characters long", 400)
    
    if len(cleaned_value) > 100:
        raise AppException("Owner name cannot exceed 100 characters", 400)
    
    return cleaned_value


@handle_exceptions
def validate_field_value(field_name, value):
    if field_name == "owner_name":
        validated_value = validate_owner_name(value)
        return validated_value
    
    raise AppException(f"Field '{field_name}' is not supported for editing", 400)


@handle_exceptions
def check_property_exists(property_id):
    filter_dict = {"_id": ObjectId(property_id)}
    property_data = db_find_one("farmhouses", filter_dict)
    
    if not property_data:
        raise AppException("Property not found", 404)
    
    return True


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
    
    validated_value = validate_field_value(field_name, value)
    db_field_path = FIELD_MAPPING[field_name]
    update_property_field_in_db(property_id, db_field_path, validated_value)
    
    return True
