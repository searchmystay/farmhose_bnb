from flask import Blueprint, jsonify, request
from src.logics.website_logic import get_approved_farmhouses, get_approved_bnbs
from src.utils.exception_handler import handle_route_exceptions

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