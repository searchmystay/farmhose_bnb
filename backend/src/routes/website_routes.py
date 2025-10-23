from flask import Blueprint, jsonify, request
from src.logics.website_logic import get_approved_farmhouses, get_approved_bnbs, get_property_details
from src.utils.exception_handler import handle_route_exceptions
from bson import ObjectId

website_bp = Blueprint('website', __name__, url_prefix='/api/website')


@website_bp.route('/farmhouse-list', methods=['GET'])
@handle_route_exceptions
def list_farmhouses():
    farmhouses_data = get_approved_farmhouses()
    
    response_data = {
        "success": True,
        "data": farmhouses_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/bnb-list', methods=['GET'])
@handle_route_exceptions
def list_bnbs():
    bnbs_data = get_approved_bnbs()
    
    response_data = {
        "success": True,
        "data": bnbs_data,
    }
    
    return jsonify(response_data)


@website_bp.route('/property-detail/<property_id>', methods=['GET'])
@handle_route_exceptions
def get_property_detail(property_id):
    object_id = ObjectId(property_id)
    property_data = get_property_details(object_id)
    
    response_data = {
        "success": True,
        "data": property_data
    }
    
    return jsonify(response_data)