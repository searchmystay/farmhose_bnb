from flask import Blueprint, jsonify, request
from src.logics.website_logic import get_approved_farmhouses, get_approved_bnbs, get_property_details, register_farmhouse, process_whatsapp_contact, get_fav_properties
from src.utils.exception_handler import handle_route_exceptions, AppException
from bson import ObjectId

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


@website_bp.route('/register-farmhouse', methods=['POST'])
@handle_route_exceptions
def register_farmhouse_route():
    farmhouse_data = request.get_json()
    image_files = request.files.getlist('images')
    document_files = request.files.getlist('documents')
    
    if not farmhouse_data and image_files and document_files:
        raise AppException("No Complete data provided")
    
    register_farmhouse(farmhouse_data, image_files, document_files)
    
    response_data = {
        "success": True,
        "message": "Farmhouse registered successfully",
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