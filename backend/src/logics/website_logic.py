from src.database.db_common_operations import db_find_many, db_find_one, db_insert_one, db_update_one
from src.utils.exception_handler import handle_exceptions, AppException
from src.logics.cloudfare_bucket import upload_farmhouse_image_to_r2, upload_farmhouse_document_to_r2
from src.config import LEAD_COST_RUPEES, MINIMUM_BALANCE_THRESHOLD
from bson import ObjectId
from datetime import datetime
import pytz


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
    name = property_data.get("name", "")
    full_description = property_data.get("description", "")
    images = property_data.get("images", [])
    amenities_data = property_data.get("amenities", [])
    location_data = property_data.get("location", {})
    
    all_amenities = extract_all_amenities(amenities_data)
    complete_address = build_complete_address(location_data)
    
    processed_data = {
        "id": property_id,
        "name": name,
        "description": full_description,
        "images": images,
        "amenities": all_amenities,
        "address": complete_address
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
    name = farmhouse_data.get("name", "")
    full_description = farmhouse_data.get("description", "")
    images = farmhouse_data.get("images", [])
    amenities_data = farmhouse_data.get("amenities", [])
    description_words = full_description.split()
    
    if len(description_words) > 20:
        truncated_description = " ".join(description_words[:20]) + "..."
    else:
        truncated_description = full_description
    
    available_amenities = extract_available_amenities(amenities_data)
    
    processed_data = {
        "id": farmhouse_id,
        "name": name,
        "description": truncated_description,
        "images": images,
        "amenities": available_amenities
    }
    
    return processed_data


@handle_exceptions
def get_approved_properties_by_type(query_filter):
    projection = {
        "_id": 1,
        "name": 1,
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
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1
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


@handle_exceptions
def validate_farmhouse_data(farmhouse_data):
    required_fields = ["name", "description", "type", "location", "whatsapp_link", "amenities"]
    
    for field in required_fields:
        if field not in farmhouse_data or not farmhouse_data[field]:
            raise AppException(f"Missing required field: {field}")
    
    location_fields = ["address", "city", "state", "pincode"]
    location_data = farmhouse_data.get("location", {})
    
    for loc_field in location_fields:
        if loc_field not in location_data or not location_data[loc_field]:
            raise AppException(f"Missing location field: {loc_field}")
    
    return True


@handle_exceptions
def upload_farmhouse_images(image_files, farmhouse_id):
    uploaded_images = []
    
    for index, image_file in enumerate(image_files):
        if image_file and image_file.filename:
            image_url = upload_farmhouse_image_to_r2(image_file, farmhouse_id, index)
            uploaded_images.append(image_url)
    
    return uploaded_images


@handle_exceptions
def upload_farmhouse_documents(document_files, farmhouse_id):
    uploaded_documents = []
    document_types = ["aadhar", "pan", "property_docs"]
    
    for index, document_file in enumerate(document_files):
        doc_type = document_types[index] if index < len(document_types) else f"document_{index}"
        document_url = upload_farmhouse_document_to_r2(document_file, farmhouse_id, doc_type)
        uploaded_documents.append(document_url)
    
    return uploaded_documents


@handle_exceptions
def update_farmhouse_db_with_file_urls(farmhouse_id, image_urls, document_urls):
    update_data = {
        "images": image_urls,
        "documents": document_urls
    }
    
    query_filter = {"_id": ObjectId(farmhouse_id)}
    update_result = db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return update_result


@handle_exceptions
def process_amenities_data(essential_amenities, experience_amenities, additional_amenities):
    category_mappings = {
        "core_amenities": {
            "source": essential_amenities,
            "fields": ["air_conditioning", "wifi_internet", "power_backup", "parking", 
                      "refrigerator", "microwave", "cooking_basics", "drinking_water", 
                      "washing_machine", "iron", "geyser_hot_water", "television", 
                      "smart_tv_ott", "wardrobe", "extra_mattress_bedding", "cleaning_supplies"]
        },
        "bedroom_bathroom": {
            "source": essential_amenities,
            "fields": ["bedrooms", "bathrooms", "beds", "bed_linens", "towels", 
                      "toiletries", "mirror", "hair_dryer", "attached_bathrooms", "bathtub"]
        },
        "outdoor_garden": {
            "source": experience_amenities,
            "fields": ["private_lawn_garden", "swimming_pool", "outdoor_seating_area", 
                      "bonfire_setup", "barbecue_setup", "terrace_balcony"]
        },
        "food_dining": {
            "source": experience_amenities,
            "fields": ["kitchen_access_self_cooking", "in_house_meals_available", "dining_table"]
        },
        "entertainment_activities": {
            "source": experience_amenities,
            "fields": ["indoor_games", "outdoor_games", "pool_table", "music_system", 
                      "board_games", "bicycle_access", "movie_projector"]
        },
        "experience_luxury_addons": {
            "source": experience_amenities,
            "fields": ["jacuzzi", "private_bar_setup", "farm_view_nature_view", 
                      "open_shower_outdoor_bath", "gazebo_cabana_seating", "hammock", 
                      "high_tea_setup", "event_space_small_gatherings", "private_chef_on_request"]
        },
        "pet_family_friendly": {
            "source": additional_amenities,
            "fields": ["pet_friendly", "child_friendly", "kids_play_area", "fenced_property"]
        },
        "safety_security": {
            "source": additional_amenities,
            "fields": ["cctv_cameras", "first_aid_kit", "fire_extinguisher", 
                      "security_guard", "private_gate_compound_wall"]
        },
        "house_rules_services": {
            "source": additional_amenities,
            "fields": ["daily_cleaning_available", "long_stays_allowed", 
                      "early_check_in_late_check_out", "staff_quarters_available", "caretaker_on_site"]
        }
    }
    
    processed_amenities = {}
    
    for category_name, config in category_mappings.items():
        source_data = config["source"]
        fields = config["fields"]
        
        category_data = {}
        for field in fields:
            category_data[field] = source_data[field]
        
        processed_amenities[category_name] = category_data
    
    return processed_amenities


@handle_exceptions
def register_property(farmhouse_data, property_images, property_documents, aadhaar_card, pan_card):
    amenities = process_amenities_data(
        farmhouse_data.get("essential_amenities", {}),
        farmhouse_data.get("experience_amenities", {}),
        farmhouse_data.get("additional_amenities", {})
    )

    location = {
        "address": farmhouse_data.get("address", ""),
        "pin_code": farmhouse_data.get("pin_code", "")
    }
    
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    
    farmhouse_record = {
        "name": farmhouse_data.get("name"),
        "description":  farmhouse_data.get("description", ""),
        "type": farmhouse_data.get("type"),
        "location": location,
        "phone_number": farmhouse_data.get("phone_number"), 
        "amenities": amenities,
        "status": "pending_approval",
        "images": [],
        "credit_balance": 0,
        "favourite": False,
        "created_at": current_time,
        "updated_at": current_time
    }
    
    insert_result = db_insert_one("farmhouses", farmhouse_record)
    farmhouse_id = str(insert_result.inserted_id)
    
    # Handle file uploads later (for now just save the basic data)
    # uploaded_images = upload_farmhouse_images(property_images, farmhouse_id)
    # uploaded_documents = upload_farmhouse_documents(property_documents, farmhouse_id)
    # update_farmhouse_db_with_file_urls(farmhouse_id, uploaded_images, uploaded_documents)
    
    return 


@handle_exceptions
def check_farmhouse_credit_balance(farmhouse_id):
    query_filter = {"_id": ObjectId(farmhouse_id), "status": "active"}
    projection = {"credit_balance": 1, "whatsapp_link": 1}
    farmhouse_data = db_find_one("farmhouses", query_filter, projection)
    
    if not farmhouse_data:
        raise AppException("Farmhouse not found or not active")
    
    current_balance = farmhouse_data.get("credit_balance", 0)
    whatsapp_link = farmhouse_data.get("whatsapp_link", "")
    
    return current_balance, whatsapp_link


@handle_exceptions
def deduct_lead_cost_from_farmhouse(farmhouse_id):
    current_balance, whatsapp_link = check_farmhouse_credit_balance(farmhouse_id)
    
    if current_balance < MINIMUM_BALANCE_THRESHOLD:
        deactivate_data = {"$set": {"status": "inactive"}}
        query_filter = {"_id": ObjectId(farmhouse_id)}
        db_update_one("farmhouses", query_filter, deactivate_data)
        raise AppException("Contact information is currently unavailable for this farmhouse")
    
    new_balance = current_balance - LEAD_COST_RUPEES

    if new_balance <= MINIMUM_BALANCE_THRESHOLD:
        update_data = {
            "$set": {
                "credit_balance": new_balance,
                "status": "inactive"
            }
        }
    else:
        update_data = {
            "$set": {"credit_balance": new_balance},
        }
    
    query_filter = {"_id": ObjectId(farmhouse_id)}
    db_update_one("farmhouses", query_filter, update_data)
    
    return new_balance, whatsapp_link


@handle_exceptions
def process_whatsapp_contact(farmhouse_id):
    new_balance, whatsapp_link = deduct_lead_cost_from_farmhouse(farmhouse_id)
    
    if not whatsapp_link:
        raise AppException("WhatsApp link not available for this farmhouse")
    
    contact_result = {
        "whatsapp_link": whatsapp_link,
    }
    
    return contact_result


@handle_exceptions
def get_fav_properties():
    farmhouse_filter = {"status": "active", "type": "farmhouse", "favourite": True}
    favourite_farmhouses = get_approved_properties_by_type(farmhouse_filter)
    bnb_filter = {"status": "active", "type": "bnb", "favourite": True}
    bnb_farmhouses = get_approved_properties_by_type(bnb_filter)

    return {
        'top_farmhouse': favourite_farmhouses,
        'top_bnb': bnb_farmhouses
    }