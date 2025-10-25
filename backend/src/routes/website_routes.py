from flask import Blueprint, jsonify, request
from src.logics.website_logic import get_approved_farmhouses, get_approved_bnbs, get_property_details, register_property, process_whatsapp_contact, get_fav_properties
from src.utils.exception_handler import handle_route_exceptions, AppException
from bson import ObjectId
import json

website_bp = Blueprint('website', __name__)


@website_bp.route('/farmhouse-list', methods=['GET'])
@handle_route_exceptions
def list_farmhouses():
    farmhouses_data = get_approved_farmhouses()
    
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


@website_bp.route('/property-detail/<property_id>', methods=['GET'])
@handle_route_exceptions
def get_property_detail(property_id):
    object_id = ObjectId(property_id)
    property_data = get_property_details(object_id)
    
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