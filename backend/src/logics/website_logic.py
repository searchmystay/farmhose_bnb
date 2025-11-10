from src.database.db_common_operations import db_find_many, db_find_one, db_insert_one, db_update_one, db_append_to_array, db_remove_from_array, db_exists
from src.database.db_owner_analysis_operations import record_visit, record_contact
from src.utils.exception_handler import handle_exceptions, AppException
from src.logics.cloudfare_bucket import upload_farmhouse_image_to_r2, upload_farmhouse_document_to_r2
from src.config import LEAD_COST_RUPEES, MINIMUM_BALANCE_THRESHOLD
from bson import ObjectId
from datetime import datetime, timedelta
import pytz


@handle_exceptions
def extract_all_amenities(amenities_data):
    all_amenities = {}
    
    for category_name, category_data in amenities_data.items():
        for amenity_name, amenity_value in category_data.items():
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
def format_amenity_name(raw_name):
    special_mappings = {
        "wifi_internet": "WiFi Internet",
        "smart_tv_ott": "Smart TV OTT",
        "cctv_cameras": "CCTV Cameras",
        "ac": "AC",
        "air_conditioning": "Air Conditioning",
        "geyser_hot_water": "Geyser Hot Water",
        "tv": "TV",
        "ott": "OTT"
    }
    
    if raw_name in special_mappings:
        return special_mappings[raw_name]
    
    formatted_name = raw_name.replace("_", " ").title()
    return formatted_name


@handle_exceptions
def format_category_name(raw_category):
    category_mappings = {
        "core_amenities": "Core Amenities",
        "bedroom_bathroom": "Bedroom & Bathroom", 
        "outdoor_garden": "Outdoor & Garden",
        "food_dining": "Food & Dining",
        "entertainment_activities": "Entertainment & Activities",
        "pet_family_friendly": "Pet & Family Friendly",
        "safety_security": "Safety & Security",
        "experience_luxury_addons": "Experience & Luxury",
        "house_rules_services": "House Rules & Services"
    }
    
    formatted_category = category_mappings.get(raw_category, raw_category.replace("_", " ").title())
    return formatted_category


@handle_exceptions
def format_amenities_for_display(raw_amenities_data):
    formatted_amenities = {}
    
    for category_key, category_data in raw_amenities_data.items():
        formatted_category_name = format_category_name(category_key)
        formatted_category_items = {}
        
        for amenity_key, amenity_value in category_data.items():
            if amenity_value:
                formatted_amenity_name = format_amenity_name(amenity_key)
                formatted_category_items[formatted_amenity_name] = amenity_value
        
        if formatted_category_items:
            formatted_amenities[formatted_category_name] = formatted_category_items
    
    return formatted_amenities


@handle_exceptions
def process_property_for_detail(property_data):
    property_id = str(property_data.get("_id"))
    name = property_data.get("name", "")
    full_description = property_data.get("description", "")
    images = property_data.get("images", [])
    raw_amenities_data = property_data.get("amenities", {})
    location_data = property_data.get("location", {})
    reviews = property_data.get("reviews", [])
    owner_details = property_data.get("owner_details", {})
    opening_time = property_data.get("opening_time", "")
    closing_time = property_data.get("closing_time", "")
    per_day_cost = property_data.get("per_day_cost", 0)
    
    formatted_amenities = format_amenities_for_display(raw_amenities_data)
    
    processed_data = {
        "_id": property_id,
        "name": name,
        "description": full_description,
        "images": images,
        "amenities": formatted_amenities,
        "location": location_data,
        "reviews": reviews,
        "owner_details": owner_details,
        "opening_time": opening_time,
        "closing_time": closing_time,
        "per_day_cost": per_day_cost
    }
    
    return processed_data


@handle_exceptions  
def process_farmhouse_for_listing(farmhouse_data):
    farmhouse_id = str(farmhouse_data.get("_id"))
    name = farmhouse_data.get("name", "")
    full_description = farmhouse_data.get("description", "")
    images = farmhouse_data.get("images", [])
    favourite = farmhouse_data.get("favourite", False)
    location = farmhouse_data.get("location", {})
    review_average = farmhouse_data.get("review_average", 0.0)
    description_words = full_description.split()
    
    if len(description_words) > 20:
        truncated_description = " ".join(description_words[:20]) + "..."
    else:
        truncated_description = full_description
    
    processed_data = {
        "_id": farmhouse_id,
        "name": name,
        "description": truncated_description,
        "images": images,
        "favourite": favourite,
        "location": location,
        "review_average": review_average
    }
    
    return processed_data


@handle_exceptions
def get_date_range(start_date, end_date):
    date_range = []
    current_date = start_date
    while current_date <= end_date:
        date_range.append(current_date.strftime('%Y-%m-%d'))
        current_date += timedelta(days=1)
    
    return date_range


@handle_exceptions
def get_approved_properties_by_type(query_filter, number_of_people=None, number_of_children=None, number_of_pets=None, check_in_date=None, check_out_date=None):
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "type": 1,
        "location": 1
    }

    if number_of_people and not isinstance(number_of_people, str):
        query_filter["max_people_allowed"] = {"$gte": number_of_people}
    
    if number_of_children and not isinstance(number_of_children, str):
        query_filter["max_children_allowed"] = {"$gte": number_of_children}
    
    if number_of_pets and not isinstance(number_of_pets, str):
        query_filter["max_pets_allowed"] = {"$gte": number_of_pets}
    
    if check_in_date and check_out_date:
        check_in_date = datetime.strptime(check_in_date, '%Y-%m-%d')
        check_out_date = datetime.strptime(check_out_date, '%Y-%m-%d')
        date_range = get_date_range(check_in_date, check_out_date)
        query_filter["booked_dates"] = {"$nin": date_range}
    
    properties_list = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in properties_list:
        farmhouse_id = property_data.get("_id")
        analysis_data = db_find_one("farmhouse_analysis", {"farmhouse_id": farmhouse_id}, {"review_average": 1})
        if analysis_data:
            property_data["review_average"] = analysis_data.get("review_average", 0.0)
        else:
            property_data["review_average"] = 0.0
        
        processed_property = process_farmhouse_for_listing(property_data)
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions
def check_property_availability(property_data, check_in_date, check_out_date, number_of_people):
    availability = True
    reason = ""
    
    if check_in_date and check_out_date:
        parsed_check_in = datetime.strptime(check_in_date, '%Y-%m-%d')
        parsed_check_out = datetime.strptime(check_out_date, '%Y-%m-%d')
        requested_date_range = get_date_range(parsed_check_in, parsed_check_out)
        
        booked_dates = property_data.get("booked_dates", [])
        for requested_date in requested_date_range:
            if requested_date in booked_dates:
                availability = False
                reason = "Property is not available for selected dates"
                break
    
    if availability and number_of_people:
        max_people = property_data.get("max_people", 0)
        if max_people > 0 and number_of_people > max_people:
            availability = False
            reason = f"Property accommodates maximum {max_people} people, but {number_of_people} requested"
    
    return availability, reason


@handle_exceptions
def get_property_details(property_id, lead_email=None, check_in_date=None, check_out_date=None, number_of_people=None):
    query_filter = {"_id": property_id, "status": "active"}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "amenities": 1,
        "location": 1,
        "reviews": 1,
        "owner_details": 1,
        "opening_time": 1,
        "closing_time": 1,
        "per_day_cost": 1,
        "booked_dates": 1,
        "max_people": 1
    }
    
    property_data = db_find_one("farmhouses", query_filter, projection)
    
    if not property_data:
        raise AppException("Property not found or not active")
    
    farmhouse_id = str(property_id)
    record_visit(farmhouse_id)
    
    processed_property = process_property_for_detail(property_data)
    
    if check_in_date and check_out_date and number_of_people:
        availability, reason = check_property_availability(property_data, check_in_date, check_out_date, number_of_people)
        processed_property["availability"] = availability
        processed_property["reason"] = reason
    else:
        processed_property["availability"] = None
        processed_property["reason"] = None
    
    if not lead_email:
        processed_property["in_wishlist"] = False
        return processed_property

    existing_lead = db_find_one("leads", {"email": lead_email})
    current_wishlist = existing_lead.get("wishlist", [])
    in_wishlist = property_id in current_wishlist
    processed_property["in_wishlist"] = in_wishlist
    return processed_property


@handle_exceptions
def get_approved_farmhouses(number_of_people=None, number_of_children=None, number_of_pets=None, check_in_date=None, check_out_date=None):
    query_filter = {"status": "active", "type": "farmhouse"}
    farmhouses_list = get_approved_properties_by_type(query_filter, number_of_people, number_of_children, number_of_pets, check_in_date, check_out_date)
    return farmhouses_list


@handle_exceptions
def get_approved_bnbs(number_of_people=None, number_of_children=None, number_of_pets=None, check_in_date=None, check_out_date=None):
    query_filter = {"status": "active", "type": "bnb"}
    bnbs_list = get_approved_properties_by_type(query_filter, number_of_people, number_of_children, number_of_pets, check_in_date, check_out_date)
    return bnbs_list


@handle_exceptions
def get_all_approved_properties(number_of_people=None, number_of_children=None, number_of_pets=None, check_in_date=None, check_out_date=None):
    query_filter = {"status": "active"}
    properties_list = get_approved_properties_by_type(query_filter, number_of_people, number_of_children, number_of_pets, check_in_date, check_out_date)
    return properties_list


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
    
    for document_file in document_files:
        original_filename = document_file.filename
        doc_type = original_filename.rsplit('.', 1)[0]  
        document_url = upload_farmhouse_document_to_r2(document_file, farmhouse_id, doc_type)
        uploaded_documents.append(document_url)
    
    return uploaded_documents


@handle_exceptions
def upload_identity_documents(aadhaar_card, pan_card, farmhouse_id):
    aadhaar_url = None
    pan_url = None
    
    if aadhaar_card and aadhaar_card.filename:
        aadhaar_url = upload_farmhouse_document_to_r2(aadhaar_card, farmhouse_id, "aadhaar")
    
    if pan_card and pan_card.filename:
        pan_url = upload_farmhouse_document_to_r2(pan_card, farmhouse_id, "pan")
    
    return aadhaar_url, pan_url


@handle_exceptions
def update_farmhouse_db_with_file_urls(farmhouse_id, image_urls, documents_data):
    update_data = {
        "images": image_urls,
        "documents": documents_data
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
    numeric_fields = ["bedrooms", "bathrooms", "beds"]
    
    for category_name, config in category_mappings.items():
        source_data = config["source"]
        fields = config["fields"]
        
        category_data = {}
        for field in fields:
            default_value = 0 if field in numeric_fields else False
            category_data[field] = source_data.get(field, default_value)
        
        processed_amenities[category_name] = category_data
    
    return processed_amenities


@handle_exceptions
def format_time_with_ampm(time_str):
        if not time_str:
            return ""
        try:
            from datetime import datetime
            time_obj = datetime.strptime(time_str, '%H:%M')
            return time_obj.strftime('%I:%M %p')
        except:
            return time_str


@handle_exceptions
def create_incomplete_property():
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    
    property_record = {
        "status": "incomplete",
        "created_at": current_time,
        "updated_at": current_time,
        "credit_balance": 0,
        "favourite": False
    }
    insert_result = db_insert_one("farmhouses", property_record)
    new_property_id = str(insert_result.inserted_id)
    return new_property_id


@handle_exceptions
def validate_name_max_words(name, max_words=3, field_name="Name"):
    if not name:
        raise AppException(f"{field_name} is required")
    
    word_count = len(name.strip().split())
    if word_count > max_words:
        raise AppException(f"{field_name} should not exceed {max_words} words")
    
    return True


@handle_exceptions
def safe_int_conversion(value, default=0):
    if value is None or value == "":
        return default
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.isdigit():
        return int(value)
    return default


@handle_exceptions
def prepare_basic_info_update(step_data):
    property_name = step_data.get("name", "")
    validate_name_max_words(property_name, 3, "Property name")
    
    if len(property_name.strip()) < 3:
        raise AppException("Property name must be at least 3 characters")
    
    opening_time = step_data.get("opening_time", "")
    closing_time = step_data.get("closing_time", "")
    opening_time_formatted = format_time_with_ampm(opening_time) if opening_time else ""
    closing_time_formatted = format_time_with_ampm(closing_time) if closing_time else ""
    
    per_day_price = safe_int_conversion(step_data.get("per_day_price"), 0)
    
    update_data = {
        "name": property_name,
        "description": step_data.get("description", ""),
        "type": step_data.get("type", ""),
        "per_day_price": per_day_price,
        "phone_number": step_data.get("phone_number", ""),
        "opening_time": opening_time_formatted,
        "closing_time": closing_time_formatted,
        "location": {
            "address": step_data.get("address", ""),
            "pin_code": step_data.get("pin_code", "")
        }
    }
    return update_data


@handle_exceptions
def prepare_amenities_update(step_data, property_id):
    existing_property = db_find_one("farmhouses", {"_id": ObjectId(property_id)}, {"amenities": 1, "max_people_allowed": 1, "max_children_allowed": 1, "max_pets_allowed": 1})
    existing_amenities = existing_property.get("amenities", {}) if existing_property else {}
    
    core_amenities = step_data.get("essential_amenities") if "essential_amenities" in step_data else existing_amenities.get("core_amenities", {})
    experience_amenities = step_data.get("experience_amenities") if "experience_amenities" in step_data else existing_amenities.get("experience_amenities", {})
    additional_amenities = step_data.get("additional_amenities") if "additional_amenities" in step_data else existing_amenities.get("additional_amenities", {})
    
    amenities = process_amenities_data(core_amenities, experience_amenities, additional_amenities)
    
    update_data = {"amenities": amenities}
    
    if "essential_amenities" in step_data:
        max_people = safe_int_conversion(step_data.get("essential_amenities", {}).get("max_people_allowed"), 0)
        max_children = safe_int_conversion(step_data.get("essential_amenities", {}).get("max_children_allowed"), 0)
        max_pets = safe_int_conversion(step_data.get("essential_amenities", {}).get("max_pets_allowed"), 0)
        
        update_data["max_people_allowed"] = max_people
        update_data["max_children_allowed"] = max_children
        update_data["max_pets_allowed"] = max_pets
    
    return update_data


@handle_exceptions
def validate_strong_password(password):
    import re
    
    if len(password) < 8:
        raise AppException("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        raise AppException("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        raise AppException("Password must contain at least one lowercase letter")
    
    if not re.search(r'[0-9]', password):
        raise AppException("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise AppException("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
    
    return True


@handle_exceptions
def check_dashboard_id_unique(dashboard_id, current_property_id=None):
    query = {"owner_details.owner_dashboard_id": dashboard_id}
    if current_property_id:
        query["_id"] = {"$ne": ObjectId(current_property_id)}
    
    existing_property = db_find_one("farmhouses", query, {"_id": 1})
    if existing_property:
        raise AppException("Dashboard ID already taken. Please choose a different ID.")
    
    return True


@handle_exceptions
def prepare_owner_details_update(step_data, property_id=None):
    owner_name = step_data.get("owner_name", "")
    validate_name_max_words(owner_name, 3, "Owner name")
    
    dashboard_id = step_data.get("owner_dashboard_id", "")
    dashboard_password = step_data.get("owner_dashboard_password", "")
    
    if not dashboard_id:
        raise AppException("Owner dashboard ID is required")
    
    if not dashboard_password:
        raise AppException("Owner dashboard password is required")
    
    validate_strong_password(dashboard_password)
    check_dashboard_id_unique(dashboard_id, property_id)
    
    update_data = {
        "owner_details": {
            "owner_name": owner_name,
            "owner_description": step_data.get("owner_description", ""),
            "owner_photo": "",
            "owner_dashboard_id": dashboard_id,
            "owner_dashboard_password": dashboard_password
        }
    }
    return update_data


@handle_exceptions
def save_partial_property_registration(step_data, property_id=None):
    if not property_id:
        property_id = create_incomplete_property()
    
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    update_data = {"updated_at": current_time}
    
    if "name" in step_data:
        basic_info_data = prepare_basic_info_update(step_data)
        update_data.update(basic_info_data)
    
    if "essential_amenities" in step_data or "experience_amenities" in step_data or "additional_amenities" in step_data:
        amenities_data = prepare_amenities_update(step_data, property_id)
        update_data.update(amenities_data)
    
    if "owner_name" in step_data:
        owner_data = prepare_owner_details_update(step_data, property_id)
        update_data.update(owner_data)
    
    query_filter = {"_id": ObjectId(property_id)}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return property_id


@handle_exceptions
def upload_partial_property_files(property_id, owner_photo=None):
    if not property_id:
        raise AppException("Property ID is required")
    
    owner_photo_url = ""
    if owner_photo and owner_photo.filename:
        owner_photo_url = upload_farmhouse_image_to_r2(owner_photo, property_id, "owner_photo")
    
    if owner_photo_url:
        query_filter = {"_id": ObjectId(property_id)}
        db_update_one("farmhouses", query_filter, {"$set": {"owner_details.owner_photo": owner_photo_url}})
    
    return owner_photo_url


@handle_exceptions
def validate_incomplete_property(property_id):
    if not property_id:
        raise AppException("Property ID is required")
    
    existing_property = db_find_one("farmhouses", {"_id": ObjectId(property_id)}, {"status": 1})
    if not existing_property:
        raise AppException("Property not found")
    
    if existing_property.get("status") != "incomplete":
        raise AppException("Property is already submitted")
    
    return True


@handle_exceptions
def upload_final_property_documents(property_id, property_images, property_documents, aadhaar_card, pan_card):
    uploaded_images = upload_farmhouse_images(property_images, property_id)
    aadhaar_url, pan_url = upload_identity_documents(aadhaar_card, pan_card, property_id)
    uploaded_property_documents = upload_farmhouse_documents(property_documents, property_id)
    
    documents_data = {
        "property_docs": uploaded_property_documents,
        "aadhar_card": aadhaar_url,
        "pan_card": pan_url 
    }
    
    return uploaded_images, documents_data


@handle_exceptions
def complete_property_registration(property_id, property_images, property_documents, aadhaar_card, pan_card):
    validate_incomplete_property(property_id)
    uploaded_images, documents_data = upload_final_property_documents(property_id, property_images, property_documents, aadhaar_card, pan_card)
    
    ist_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist_timezone).replace(tzinfo=None)
    
    update_data = {
        "images": uploaded_images,
        "documents": documents_data,
        "status": "pending_approval",
        "updated_at": current_time
    }
    
    query_filter = {"_id": ObjectId(property_id)}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    
    return property_id


@handle_exceptions
def register_property(farmhouse_data, property_images, property_documents, aadhaar_card, pan_card, owner_photo):
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
    opening_time_formatted = format_time_with_ampm(farmhouse_data.get("opening_time", ""))
    closing_time_formatted = format_time_with_ampm(farmhouse_data.get("closing_time", ""))
    
    owner_details = {
        "owner_name": farmhouse_data.get("owner_name", ""),
        "owner_description": farmhouse_data.get("owner_description", ""),
        "owner_photo": ""
    }
    
    farmhouse_record = {
        "name": farmhouse_data.get("name"),
        "description":  farmhouse_data.get("description", ""),
        "type": farmhouse_data.get("type"),
        "per_day_price": int(farmhouse_data.get("per_day_price", 0)) if farmhouse_data.get("per_day_price") else 0,
        "max_people_allowed": int(farmhouse_data.get("max_people_allowed", 0)) if farmhouse_data.get("max_people_allowed") else 0,
        "opening_time": opening_time_formatted,
        "closing_time": closing_time_formatted,
        "location": location,
        "phone_number": farmhouse_data.get("phone_number"), 
        "amenities": amenities,
        "owner_details": owner_details,
        "status": "pending_approval",
        "images": [],
        "credit_balance": 0,
        "favourite": False,
        "created_at": current_time,
        "updated_at": current_time
    }
    
    insert_result = db_insert_one("farmhouses", farmhouse_record)
    farmhouse_id = str(insert_result.inserted_id)
    
    uploaded_images = upload_farmhouse_images(property_images, farmhouse_id)
    aadhaar_url, pan_url= upload_identity_documents(aadhaar_card, pan_card, farmhouse_id)
    uploaded_property_documents = upload_farmhouse_documents(property_documents, farmhouse_id)
    
    owner_photo_url = ""
    if owner_photo and owner_photo.filename:
        owner_photo_url = upload_farmhouse_image_to_r2(owner_photo, farmhouse_id, "owner_photo")
    
    documents_data = {
        "property_docs": uploaded_property_documents,
        "aadhar_card": aadhaar_url,
        "pan_card": pan_url 
    }
    
    update_data = {
        "images": uploaded_images,
        "documents": documents_data,
        "owner_details.owner_photo": owner_photo_url
    }
    
    query_filter = {"_id": ObjectId(farmhouse_id)}
    db_update_one("farmhouses", query_filter, {"$set": update_data})
    return farmhouse_id 


@handle_exceptions
def generate_whatsapp_url(phone_number):
    if not phone_number:
        raise AppException("Phone number not avilable")
    
    clean_number = ''.join(filter(str.isdigit, phone_number))
    number = f"91{clean_number}"
    
    whatsapp_url = f"https://wa.me/{number}"
    return whatsapp_url


@handle_exceptions
def check_farmhouse_credit_balance(farmhouse_id):
    query_filter = {"_id": ObjectId(farmhouse_id), "status": "active"}
    projection = {"credit_balance": 1, "phone_number": 1}
    farmhouse_data = db_find_one("farmhouses", query_filter, projection)
    
    if not farmhouse_data:
        raise AppException("Farmhouse not found or not active")
    
    current_balance = farmhouse_data.get("credit_balance", 0)
    phone_number = farmhouse_data.get("phone_number", "")
    whatsapp_link = generate_whatsapp_url(phone_number)
    
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
    
    record_contact(farmhouse_id)
    
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


@handle_exceptions
def toggle_wishlist(email, farmhouse_id):
    farmhouse_object_id = ObjectId(farmhouse_id)
    existing_lead = db_find_one("leads", {"email": email})

    if not existing_lead:
        raise AppException("Email not found")
    
    current_wishlist = existing_lead.get("wishlist", [])
    
    if farmhouse_object_id in current_wishlist:
        db_remove_from_array("leads", {"email": email}, "wishlist", farmhouse_object_id)
        action = "removed"
    else:
        db_append_to_array("leads", {"email": email}, "wishlist", farmhouse_object_id)
        action = "added"
    
    return action


@handle_exceptions
def create_lead(email, name=None, mobile_number=None):
    existing_lead = db_find_one("leads", {"email": email})
    
    if existing_lead:
        return True
    
    lead_data = {
        "email": email,
        "wishlist": []
    }
    
    if name:
        lead_data["name"] = name
    
    if mobile_number:
        lead_data["mobile_number"] = mobile_number
    
    db_insert_one("leads", lead_data)
    return True


@handle_exceptions
def get_user_wishlist(email):
    existing_lead = db_find_one("leads", {"email": email})
    
    if not existing_lead:
        raise AppException("Email not found")
    
    wishlist_ids = existing_lead.get("wishlist", [])
    
    if not wishlist_ids:
        return []
    
    query_filter = {"_id": {"$in": wishlist_ids}, "status": "active"}
    projection = {
        "_id": 1,
        "name": 1,
        "description": 1,
        "images": 1,
        "location": 1
    }
    
    properties_list = db_find_many("farmhouses", query_filter, projection)
    
    processed_properties = []
    for property_data in properties_list:
        farmhouse_id = property_data.get("_id")
        analysis_data = db_find_one("farmhouse_analysis", {"farmhouse_id": farmhouse_id}, {"review_average": 1})
        property_data["review_average"] = analysis_data.get("review_average", 0.0)
        processed_property = process_farmhouse_for_listing(property_data)
        processed_properties.append(processed_property)
    
    return processed_properties


@handle_exceptions
def submit_review(farmhouse_id, reviewer_name, rating, review_comment):
    farmhouse_exists = db_exists("farmhouses", {"_id": farmhouse_id})
    
    if not farmhouse_exists:
        raise AppException("Farmhouse not found")
    
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        raise AppException("Rating must be an integer between 1 and 5")
    
    review_data = {
        "farmhouse_id": farmhouse_id,
        "reviewer_name": reviewer_name,
        "rating": rating,
        "review_comment": review_comment
    }
    
    db_insert_one("pending_reviews", review_data)
    return True


@handle_exceptions
def get_farmhouse_name(farmhouse_id):
    farmhouse_data = db_find_one("farmhouses", {"_id": farmhouse_id}, {"name": 1})
    
    if not farmhouse_data:
        raise AppException("Farmhouse not found")
    
    farmhouse_name = farmhouse_data["name"]
    return farmhouse_name
