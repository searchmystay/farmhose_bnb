from src.database.db_common_operations import db_find_many
from src.utils.exception_handler import handle_exceptions


@handle_exceptions
def get_approved_properties_by_type(query_filter):
    projection = {
        "_id": 1,
        "title": 1,
        "description": 1,
        "type": 1,
        "location.city": 1,
        "location.state": 1,
        "images": 1
    }
    
    properties_list = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in properties_list:
        processed_property = process_farmhouse_for_listing(property_data)
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions  
def process_farmhouse_for_listing(farmhouse_data):
    farmhouse_id = str(farmhouse_data.get("_id"))
    title = farmhouse_data.get("title", "")
    full_description = farmhouse_data.get("description", "")
    property_type = farmhouse_data.get("type", "")
    images = farmhouse_data.get("images", [])
    
    location_data = farmhouse_data.get("location", {})
    city = location_data.get("city", "")
    state = location_data.get("state", "")
    description_words = full_description.split()

    if len(description_words) > 50:
        truncated_description = " ".join(description_words[:50]) + "..."
    else:
        truncated_description = full_description
    
    processed_data = {
        "id": farmhouse_id,
        "title": title,
        "description": truncated_description,
        "type": property_type,
        "location": f"{city}, {state}",
        "images": images
    }
    
    return processed_data


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