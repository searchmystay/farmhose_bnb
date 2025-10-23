from src.database.db_common_operations import db_find_many
from src.utils.exception_handler import handle_exceptions


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
def get_approved_farmhouses():
    query_filter = {"status": "active", "type": "farmhouse"}
    farmhouses_list = get_approved_properties_by_type(query_filter)
    return farmhouses_list


@handle_exceptions
def get_approved_bnbs():
    query_filter = {"status": "active", "type": "bnb"}
    bnbs_list = get_approved_properties_by_type(query_filter)
    return bnbs_list