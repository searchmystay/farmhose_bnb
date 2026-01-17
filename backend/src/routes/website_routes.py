from flask import Blueprint, jsonify, request
from src.logics.website_logic import *
from src.database.db_common_operations import db_update_by_id
from src.utils.exception_handler import handle_route_exceptions, AppException
from src.config import MAX_SEARCH_DISTANCE_KM
from bson import ObjectId
import json

website_bp = Blueprint('website', __name__)

@website_bp.route('/farmhouse-list', methods=['POST'])
@handle_route_exceptions
def list_farmhouses():
    data = request.get_json() or {}
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')
    number_of_people = data.get('numberOfPeople')
    address = data.get('address')
    number_of_adults = data.get('numberOfAdults')
    number_of_children = data.get('numberOfChildren')
    number_of_pets = data.get('numberOfPets')
    
    search_latitude = data.get('searchLatitude')
    search_longitude = data.get('searchLongitude')
    
    total_people = number_of_adults if number_of_adults is not None else number_of_people
    farmhouses_data = get_approved_farmhouses(total_people, number_of_children, number_of_pets, search_latitude, search_longitude, MAX_SEARCH_DISTANCE_KM, check_in_date, check_out_date)
    
    response_data = {
        "success": True,
        "backend_data": farmhouses_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/bnb-list', methods=['POST'])
@handle_route_exceptions
def list_bnbs():
    data = request.get_json() or {}
    number_of_people = data.get('numberOfPeople')
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')
    address = data.get('address')
    number_of_adults = data.get('numberOfAdults')
    number_of_children = data.get('numberOfChildren')
    number_of_pets = data.get('numberOfPets')
    
    search_latitude = data.get('searchLatitude')
    search_longitude = data.get('searchLongitude')
    
    total_people = number_of_adults if number_of_adults is not None else number_of_people
    bnbs_data = get_approved_bnbs(total_people, number_of_children, number_of_pets, search_latitude, search_longitude, MAX_SEARCH_DISTANCE_KM, check_in_date, check_out_date)
    
    response_data = {
        "success": True,
        "backend_data": bnbs_data,
    }
    
    return jsonify(response_data)

@website_bp.route('/property-list', methods=['POST'])
@handle_route_exceptions
def list_properties():
    data = request.get_json() or {}
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')
    number_of_people = data.get('numberOfPeople')
    address = data.get('address')
    number_of_adults = data.get('numberOfAdults')
    number_of_children = data.get('numberOfChildren')
    number_of_pets = data.get('numberOfPets')
    
    search_latitude = data.get('searchLatitude')
    search_longitude = data.get('searchLongitude')
    
    total_people = number_of_adults if number_of_adults is not None else number_of_people
    properties_data = get_all_approved_properties(total_people, number_of_children, number_of_pets, search_latitude, search_longitude, MAX_SEARCH_DISTANCE_KM, check_in_date, check_out_date)
    
    response_data = {
        "success": True,
        "backend_data": properties_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/property-detail/<property_id>', methods=['POST'])
@handle_route_exceptions
def get_property_detail(property_id):
    data = request.get_json() or {}
    lead_email = data.get('leadEmail')
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')
    number_of_people = data.get('numberOfPeople')
    address = data.get('address')
    number_of_adults = data.get('numberOfAdults')
    number_of_children = data.get('numberOfChildren')
    number_of_pets = data.get('numberOfPets')
    
    print("\n" + "="*50)
    print(f"PROPERTY DETAIL - Property ID: {property_id}")
    print("="*50)
    print(f"Lead Email: {lead_email}")
    print(f"Check-in Date: {check_in_date}")
    print(f"Check-out Date: {check_out_date}")
    print(f"Address/Location: {address}")
    print(f"Number of Adults: {number_of_adults}")
    print(f"Number of Children: {number_of_children}")
    print(f"Number of Pets: {number_of_pets}")
    print(f"Number of People (old field): {number_of_people}")
    print("="*50 + "\n")
    
    object_id = ObjectId(property_id)
    property_data = get_property_details(object_id, lead_email, check_in_date, check_out_date, number_of_people)
    
    response_data = {
        "success": True,
        "backend_data": property_data
    }
    
    return jsonify(response_data)


@website_bp.route('/save-basic-info', methods=['POST'])
@handle_route_exceptions
def save_basic_info_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    
    location_data = data.get('location')
    if not location_data:
        location_data = {
            "address": data.get('address', ''),
            "pin_code": data.get('pin_code', '')
        }
    else:
        if 'pin_code' not in location_data or not location_data.get('pin_code'):
            location_data['pin_code'] = data.get('pin_code', '')
        if 'address' not in location_data:
            location_data['address'] = data.get('address', '')
    
    step_data = {
        "name": data.get('name'),
        "description": data.get('description'),
        "type": data.get('type'),
        "per_day_price": data.get('per_day_price'),
        "opening_time": data.get('opening_time'),
        "closing_time": data.get('closing_time'),
        "phone_number": data.get('phone_number'),
        "location": location_data
    }

    saved_property_id = save_partial_property_registration(step_data, property_id)
    phone_number = step_data.get("phone_number")
    process_otp_request(phone_number)
    
    response_data = {
        "success": True,
        "message": "Basic information saved successfully",
        "propertyId": saved_property_id
    }
    
    return jsonify(response_data), 200


@website_bp.route('/save-essential-amenities', methods=['POST'])
@handle_route_exceptions
def save_essential_amenities_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    essential_amenities = data.get('essential_amenities', {})
    
    if not property_id:
        raise AppException("Property ID is required")
    
    # Only update essential amenities fields, don't reprocess entire structure
    update_data = {}
    
    # Core amenities fields
    core_fields = ["air_conditioning", "wifi_internet", "power_backup", "parking", 
                  "refrigerator", "microwave", "cooking_basics", "drinking_water", 
                  "washing_machine", "iron", "geyser_hot_water", "television", 
                  "smart_tv_ott", "wardrobe", "extra_mattress_bedding", "cleaning_supplies"]
    
    for field in core_fields:
        if field in essential_amenities:
            update_data[f"amenities.core_amenities.{field}"] = bool(essential_amenities[field])
    
    # Bedroom & bathroom fields
    bedroom_fields = ["bedrooms", "bathrooms", "beds", "bed_linens", "towels", 
                     "toiletries", "mirror", "hair_dryer", "attached_bathrooms", "bathtub"]
    
    numeric_fields = ["bedrooms", "bathrooms", "beds"]
    for field in bedroom_fields:
        if field in essential_amenities:
            if field in numeric_fields:
                update_data[f"amenities.bedroom_bathroom.{field}"] = safe_int_conversion(essential_amenities[field], 0)
            else:
                update_data[f"amenities.bedroom_bathroom.{field}"] = bool(essential_amenities[field])
    
    # Guest capacity fields - save to property root level (not in amenities)
    guest_fields = ["max_people_allowed", "max_children_allowed", "max_pets_allowed"]
    for field in guest_fields:
        if field in essential_amenities:
            update_data[field] = safe_int_conversion(essential_amenities[field], 0)
    
    if update_data:
        saved_property_id = save_targeted_amenities_update(property_id, update_data)
        response_data = {
            "success": True,
            "message": "Essential amenities saved successfully",
            "propertyId": saved_property_id
        }
        return jsonify(response_data), 200
    else:
        raise AppException("No valid amenities data provided")


@website_bp.route('/save-experience-amenities', methods=['POST'])
@handle_route_exceptions
def save_experience_amenities_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    experience_amenities = data.get('experience_amenities', {})
    
    if not property_id:
        raise AppException("Property ID is required")
    
    # Only update experience amenities fields, don't reprocess entire structure
    update_data = {}
    
    # Outdoor & garden fields
    outdoor_fields = ["private_lawn_garden", "swimming_pool", "outdoor_seating_area", 
                     "bonfire_setup", "barbecue_setup", "terrace_balcony"]
    
    for field in outdoor_fields:
        if field in experience_amenities:
            update_data[f"amenities.outdoor_garden.{field}"] = bool(experience_amenities[field])
    
    # Food & dining fields
    food_fields = ["kitchen_access_self_cooking", "in_house_meals_available", "dining_table"]
    
    for field in food_fields:
        if field in experience_amenities:
            update_data[f"amenities.food_dining.{field}"] = bool(experience_amenities[field])
    
    # Entertainment & activities fields
    entertainment_fields = ["indoor_games", "outdoor_games", "pool_table", "music_system", 
                           "board_games", "bicycle_access", "movie_projector"]
    
    for field in entertainment_fields:
        if field in experience_amenities:
            update_data[f"amenities.entertainment_activities.{field}"] = bool(experience_amenities[field])
    
    # Experience & luxury addons fields
    luxury_fields = ["jacuzzi", "private_bar_setup", "farm_view_nature_view", 
                    "open_shower_outdoor_bath", "gazebo_cabana_seating", "hammock", 
                    "high_tea_setup", "event_space_small_gatherings", "private_chef_on_request"]
    
    for field in luxury_fields:
        if field in experience_amenities:
            update_data[f"amenities.experience_luxury_addons.{field}"] = bool(experience_amenities[field])
    
    if update_data:
        saved_property_id = save_targeted_amenities_update(property_id, update_data)
        response_data = {
            "success": True,
            "message": "Experience amenities saved successfully",
            "propertyId": saved_property_id
        }
        return jsonify(response_data), 200
    else:
        raise AppException("No valid amenities data provided")


@website_bp.route('/save-additional-amenities', methods=['POST'])
@handle_route_exceptions
def save_additional_amenities_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    additional_amenities = data.get('additional_amenities', {})
    
    if not property_id:
        raise AppException("Property ID is required")
    
    # Only update additional amenities fields, don't reprocess entire structure
    update_data = {}
    
    # Pet & family friendly fields
    pet_fields = ["pet_friendly", "child_friendly", "kids_play_area", "fenced_property"]
    
    for field in pet_fields:
        if field in additional_amenities:
            update_data[f"amenities.pet_family_friendly.{field}"] = bool(additional_amenities[field])
    
    # Safety & security fields
    safety_fields = ["cctv_cameras", "first_aid_kit", "fire_extinguisher", 
                    "security_guard", "private_gate_compound_wall"]
    
    for field in safety_fields:
        if field in additional_amenities:
            update_data[f"amenities.safety_security.{field}"] = bool(additional_amenities[field])
    
    # House rules & services fields (exclude guest capacity fields)
    house_fields = ["daily_cleaning_available", "long_stays_allowed", 
                   "early_check_in_late_check_out", "staff_quarters_available", "caretaker_on_site"]
    
    for field in house_fields:
        if field in additional_amenities:
            update_data[f"amenities.house_rules_services.{field}"] = bool(additional_amenities[field])
    
    # Guest capacity fields - save to property root level (not in amenities)
    guest_fields = ["max_people_allowed", "max_children_allowed", "max_pets_allowed"]
    for field in guest_fields:
        if field in additional_amenities:
            update_data[field] = safe_int_conversion(additional_amenities[field], 0)
    
    if update_data:
        saved_property_id = save_targeted_amenities_update(property_id, update_data)
        response_data = {
            "success": True,
            "message": "Additional amenities saved successfully",
            "propertyId": saved_property_id
        }
        return jsonify(response_data), 200
    else:
        raise AppException("No valid amenities data provided")


@website_bp.route('/save-owner-details', methods=['POST'])
@handle_route_exceptions
def save_owner_details_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    
    if not property_id:
        raise AppException("Property ID is required")
    
    step_data = {
        "owner_name": data.get('owner_name'),
        "owner_description": data.get('owner_description'),
        "owner_dashboard_id": data.get('owner_dashboard_id'),
        "owner_dashboard_password": data.get('owner_dashboard_password')
    }
    
    saved_property_id = save_partial_property_registration(step_data, property_id)
    
    response_data = {
        "success": True,
        "message": "Owner details saved successfully",
        "propertyId": saved_property_id
    }
    
    return jsonify(response_data), 200


@website_bp.route('/upload-owner-photo', methods=['POST'])
@handle_route_exceptions
def upload_owner_photo_route():
    property_id = request.form.get('propertyId')
    owner_photo = request.files.get('ownerPhoto')
    
    if not property_id:
        raise AppException("Property ID is required")
    
    if not owner_photo:
        raise AppException("Owner photo is required")
    
    photo_url = upload_partial_property_files(property_id, owner_photo)
    
    response_data = {
        "success": True,
        "message": "Owner photo uploaded successfully",
        "photoUrl": photo_url
    }
    
    return jsonify(response_data), 200


@website_bp.route('/complete-property-registration', methods=['POST'])
@handle_route_exceptions
def complete_property_registration_route():
    property_id = request.form.get('propertyId')
    property_images = request.files.getlist('propertyImages')
    property_documents = request.files.getlist('propertyDocuments')
    aadhaar_card = request.files.get('aadhaarCard')
    pan_card = request.files.get('panCard')
    
    if not property_id:
        raise AppException("Property ID is required")
    
    if not property_images or len(property_images) == 0:
        raise AppException("Property images are required")
    
    if not property_documents or len(property_documents) == 0:
        raise AppException("Property documents are required")
    
    if not aadhaar_card:
        raise AppException("Aadhaar card is required")
    
    if not pan_card:
        raise AppException("PAN card is required")
    
    completed_property_id = complete_property_registration(property_id, property_images, property_documents, aadhaar_card, pan_card)
    
    response_data = {
        "success": True,
        "message": "Property registration completed successfully",
        "propertyId": completed_property_id
    }
    
    return jsonify(response_data), 200


@website_bp.route('/contact-whatsapp/<farmhouse_id>', methods=['POST'])
@handle_route_exceptions
def contact_via_whatsapp(farmhouse_id):
    contact_result = process_whatsapp_contact(farmhouse_id)
    
    response_data = {
        "success": True,
        "backend_data": contact_result
    }
    
    return jsonify(response_data), 200


@website_bp.route('/top-properties', methods=['GET'])
@handle_route_exceptions
def get_top_properties():
    top_properties_data = get_fav_properties()
    
    response_data = {
        "success": True,
        "backend_data": top_properties_data
    }
    
    return jsonify(response_data), 200


@website_bp.route('/toggle-wishlist', methods=['POST'])
@handle_route_exceptions
def toggle_wishlist_route():
    data = request.get_json()
    
    email = data.get('email')
    farmhouse_id = data.get('farmhouse_id')
    
    if not email or not farmhouse_id:
        raise AppException("Email and farmhouse_id are required")
    
    action = toggle_wishlist(email, farmhouse_id)
    
    response_data = {
        "success": True,
        "message": f"{action} to wishlist"
    }
    
    return jsonify(response_data), 200


@website_bp.route('/create-lead', methods=['POST'])
@handle_route_exceptions
def create_lead_route():
    data = request.get_json()
    
    email = data.get('email')
    name = data.get('name')
    mobile_number = data.get('mobile_number')
    
    if not email:
        raise AppException("Email is required")
    
    create_lead(email, name, mobile_number)
    
    response_data = {
        "success": True,
        "message": "Lead created successfully"
    }
    
    return jsonify(response_data), 200


@website_bp.route('/get-wishlist', methods=['POST'])
@handle_route_exceptions
def get_wishlist_route():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        raise AppException("Email is required")
    
    wishlist_properties = get_user_wishlist(email)
    
    response_data = {
        "success": True,
        "backend_data": wishlist_properties,
    }
    
    return jsonify(response_data), 200


@website_bp.route('/submit-review', methods=['POST'])
@handle_route_exceptions
def submit_review_route():
    data = request.get_json()
    
    farmhouse_id = data.get('farmhouse_id')
    reviewer_name = data.get('reviewer_name')
    rating = data.get('rating')
    review_comment = data.get('review_comment')
    
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    if not reviewer_name:
        raise AppException("Reviewer name is required")
    if not rating:
        raise AppException("Rating is required")
    if not review_comment:
        raise AppException("Review comment is required")
    
    # Validate minimum word count (10 words)
    word_count = len(review_comment.strip().split())
    if word_count < 10:
        raise AppException(f"Review must be at least 10 words. Current: {word_count} words")
    
    object_id = ObjectId(farmhouse_id)
    submit_review(object_id, reviewer_name, rating, review_comment)
    
    response_data = {
        "success": True,
        "message": "Review submitted successfully for approval"
    }
    
    return jsonify(response_data), 200


@website_bp.route('/farmhouse-name/<farmhouse_id>', methods=['GET'])
@handle_route_exceptions
def get_farmhouse_name_route(farmhouse_id):
    object_id = ObjectId(farmhouse_id)
    farmhouse_name = get_farmhouse_name(object_id)
    
    response_data = {
        "success": True,
        "backend_data": {
            "farmhouse_name": farmhouse_name
        }
    }
    
    return jsonify(response_data), 200


@website_bp.route('/verify-otp', methods=['POST'])
@handle_route_exceptions
def verify_otp_route():
    data = request.get_json() or {}
    property_id = data.get('propertyId')
    entered_otp = data.get('otpCode')
    
    if not property_id:
        raise AppException("Property ID is required")
    
    if not entered_otp:
        raise AppException("OTP is required")
    
    verify_otp_and_update_phone(property_id, entered_otp)
    
    response_data = {
        "success": True,
        "message": "Phone number verified successfully"
    }
    
    return jsonify(response_data), 200