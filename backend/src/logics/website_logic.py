from src.database.db_common_operations import db_find_many, db_find_one
from src.utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def extract_all_amenities(amenities_data):
    all_amenities = {}
    
    for amenity_object in amenities_data:
        for amenity_name, amenity_value in amenity_object.items():
            all_amenities[amenity_name] = amenity_value
    
    return all_amenities


@handle_exceptions
def build_complete_address(location_data):
    address = location_data.get("address", "")
    city = location_data.get("city", "")
    state = location_data.get("state", "")
    pincode = location_data.get("pincode", "")
    
    address_parts = [part for part in [address, city, state, pincode] if part]
    complete_address = ", ".join(address_parts)
    
    return complete_address


@handle_exceptions
def process_property_for_detail(property_data):
    property_id = str(property_data.get("_id"))
    title = property_data.get("title", "")
    full_description = property_data.get("description", "")
    images = property_data.get("images", [])
    amenities_data = property_data.get("amenities", [])
    location_data = property_data.get("location", {})
    contact_info = property_data.get("contact_info", {})
    
    all_amenities = extract_all_amenities(amenities_data)
    complete_address = build_complete_address(location_data)
    whatsapp_link = contact_info.get("whatsapp_link", "")
    
    processed_data = {
        "id": property_id,
        "title": title,
        "description": full_description,
        "images": images,
        "amenities": all_amenities,
        "address": complete_address,
        "whatsapp_link": whatsapp_link
    }
    
    return processed_data


@handle_exceptions
def extract_available_amenities(amenities_data):
    available_amenities = []
    
    for amenity_object in amenities_data:
        for amenity_name, amenity_value in amenity_object.items():
            if amenity_value == "true":
                available_amenities.append(amenity_name)
    
    return available_amenities


@handle_exceptions  
def process_farmhouse_for_listing(farmhouse_data):
    farmhouse_id = str(farmhouse_data.get("_id"))
    title = farmhouse_data.get("title", "")
    full_description = farmhouse_data.get("description", "")
    images = farmhouse_data.get("images", [])
    amenities_data = farmhouse_data.get("amenities", [])
    description_words = full_description.split()
    
    if len(description_words) > 50:
        truncated_description = " ".join(description_words[:50]) + "..."
    else:
        truncated_description = full_description
    
    available_amenities = extract_available_amenities(amenities_data)
    
    processed_data = {
        "id": farmhouse_id,
        "title": title,
        "description": truncated_description,
        "images": images,
        "amenities": available_amenities
    }
    
    return processed_data


@handle_exceptions
def get_approved_properties_by_type(query_filter):
    projection = {
        "_id": 1,
        "title": 1,
        "description": 1,
        "images": 1,
        "amenities": 1
    }
    
    properties_list = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in properties_list:
        processed_property = process_farmhouse_for_listing(property_data)
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions
def get_property_details(property_id):
    query_filter = {"_id": property_id, "status": "active"}
    projection = {
        "_id": 1,
        "title": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1,
        "contact_info.whatsapp_link": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Property not found or not active")
    
    processed_property = process_property_for_detail(property_data)
    return processed_property


@handle_exceptions
def get_approved_farmhouses():
    query_filter = {"status": "active", "type": "farmhouse"}
    farmhouses_list = get_approved_properties_by_type(query_filter)
    return farmhouses_list


@handle_exceptions
def get_approved_bnbs():
    query_filter = {"status": "active", "type": "bnb"}
    bnbs_list = get_approved_properties_by_type(query_filter)
    return bnbs_list