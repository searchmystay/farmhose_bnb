from flask import Blueprint, jsonify, request, make_response
from src.logics.admin_logics import process_admin_login, get_pending_properties, get_pending_property_details, approve_pending_property
from src.logics.admin_auth import super_admin_required
from src.utils.exception_handler import handle_route_exceptions


admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/super_admin_login', methods=['POST'])
@handle_route_exceptions
def admin_login():
    login_data = request.get_json()
    
    if not login_data:
        return jsonify({"success": False, "message": "No data provided"}), 400
    
    login_result = process_admin_login(login_data)
    
    response_data = {
        "success": True,
        "backend_data": {
            "message": login_result.get("message"),
            "superadmin": login_result.get("superadmin"),
            "expires_in": login_result.get("expires_in")
        }
    }
    
    response = make_response(jsonify(response_data), 200)
    response.set_cookie(
        'admin_token',
        login_result.get("token"),
        max_age=24*60*60,
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    
    return response


@admin_bp.route('/pending_properties', methods=['GET'])
@super_admin_required
@handle_route_exceptions
def get_pending_properties_route():
    pending_properties = get_pending_properties()
    
    response_data = {
        "success": True,
        "message": "Pending properties retrieved successfully",
        "backend_data": {
            "properties": pending_properties,
        }
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/pending_property/<property_id>', methods=['GET'])
@super_admin_required
@handle_route_exceptions
def get_pending_property_details_route(property_id):
    property_details = get_pending_property_details(property_id)
    
    response_data = {
        "success": True,
        "message": "Pending property details retrieved successfully",
        "backend_data": property_details
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/approve_property/<property_id>', methods=['POST'])
@super_admin_required
@handle_route_exceptions
def approve_property_route(property_id):
    approve_pending_property(property_id)
    
    response_data = {
        "success": True,
        "message": "Property approved successfully",
    }
    
    return jsonify(response_data), 200