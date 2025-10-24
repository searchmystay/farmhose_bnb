from src.database.db_common_operations import db_find_many, db_find_one, db_insert_one, db_update_one
from src.utils.exception_handler import handle_exceptions, AppException
from src.logics.cloudfare_bucket import upload_farmhouse_image_to_r2, upload_farmhouse_document_to_r2
from src.config import LEAD_COST_RUPEES
from bson import ObjectId


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
def register_farmhouse(farmhouse_data, image_files, document_files):
    validate_farmhouse_data(farmhouse_data)
    
    farmhouse_record = {
        "name": farmhouse_data.get("name"),
        "description": farmhouse_data.get("description"),
        "type": farmhouse_data.get("type"),
        "location": farmhouse_data.get("location"),
        "whatsapp_link": farmhouse_data.get("whatsapp_link"),
        "amenities": farmhouse_data.get("amenities"),
        "status": "pending_approval",
        "images": [],
        "documents": [],
        "credit_balance": 0
    }
    
    insert_result = db_insert_one("farmhouses", farmhouse_record)
    farmhouse_id = str(insert_result.inserted_id)
    
    uploaded_images = upload_farmhouse_images(image_files, farmhouse_id)
    uploaded_documents = upload_farmhouse_documents(document_files, farmhouse_id)
    update_farmhouse_db_with_file_urls(farmhouse_id, uploaded_images, uploaded_documents)
    
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
    
    if current_balance < LEAD_COST_RUPEES:
        raise AppException("Insufficient credit balance for this farmhouse")
    
    new_balance = current_balance - LEAD_COST_RUPEES
    update_data = {
        "$set": {"credit_balance": new_balance},
        "$inc": {"click_count": 1}
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
