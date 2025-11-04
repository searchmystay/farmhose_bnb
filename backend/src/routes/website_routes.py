from flask import Blueprint, jsonify, request
from src.logics.website_logic import *
from src.utils.exception_handler import handle_route_exceptions, AppException
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
    
    farmhouses_data = get_approved_farmhouses(check_in_date, check_out_date, number_of_people)
    
    response_data = {
        "success": True,
        "backend_data": farmhouses_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/bnb-list', methods=['GET'])
@handle_route_exceptions
def list_bnbs():
    bnbs_data = get_approved_bnbs()
    
    response_data = {
        "success": True,
        "backend_data": bnbs_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/property-detail/<property_id>', methods=['POST'])
@handle_route_exceptions
def get_property_detail(property_id):
    data = request.get_json() or {}
    lead_email = data.get('leadEmail')
    
    object_id = ObjectId(property_id)
    property_data = get_property_details(object_id, lead_email)
    
    response_data = {
        "success": True,
        "backend_data": property_data
    }
    
    return jsonify(response_data)


@website_bp.route('/register-property', methods=['POST'])
@handle_route_exceptions
def register_property_route():
    name = request.form.get('name')
    description = request.form.get('description')
    property_type = request.form.get('type')
    phone_number = request.form.get('phone_number')
    address = request.form.get('address')
    pin_code = request.form.get('pin_code')
    
    essential_amenities = json.loads(request.form.get('essentialAmenities', '{}'))
    experience_amenities = json.loads(request.form.get('experienceAmenities', '{}'))
    additional_amenities = json.loads(request.form.get('additionalAmenities', '{}'))

    property_images = request.files.getlist('propertyImages')
    property_documents = request.files.getlist('propertyDocuments')
    aadhaar_card = request.files.get('aadhaarCard')
    pan_card = request.files.get('panCard')
    
    farmhouse_data = {
        "name": name,
        "description": description,
        "type": property_type,
        "phone_number": phone_number,
        "address": address,
        "pin_code": pin_code,
        "essential_amenities": essential_amenities,
        "experience_amenities": experience_amenities,
        "additional_amenities": additional_amenities
    }
    
    if not name or not description or not property_type:
        raise AppException("Basic information is required")
    
    register_property(farmhouse_data, property_images, property_documents, aadhaar_card, pan_card)
    
    response_data = {
        "success": True,
        "message": "Property registered successfully",
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