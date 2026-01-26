from flask import Blueprint, jsonify, request, make_response
from src.logics.admin_logics import *
from src.logics.admin_auth import admin_required
from src.logics.admin_kpi_logic import get_admin_dashboard_kpis
from src.utils.exception_handler import handle_route_exceptions, AppException
from src.logics.property_edit_logic import update_property_field


admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/admin_login', methods=['POST'])
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
        secure=True,
        samesite='None'
    )
    
    return response


@admin_bp.route('/admin_logout', methods=['POST'])
@handle_route_exceptions
def admin_logout():
    response_data = {
        "success": True,
        "message": "Logged out successfully"
    }
    
    response = make_response(jsonify(response_data), 200)
    response.set_cookie(
        'admin_token',
        '',
        max_age=0,
        httponly=True,
        secure=True,
        samesite='None'
    )
    
    return response


@admin_bp.route('/auto_login', methods=['GET'])
@admin_required
@handle_route_exceptions
def auto_login():
    return jsonify({
        "status": "success",
        "backend_data": {"admin": True, "role": "admin"}
    }), 200


@admin_bp.route('/pending_properties', methods=['GET'])
@admin_required
@handle_route_exceptions
def get_pending_properties_route():
    pending_properties = get_pending_properties()
    
    response_data = {
        "success": True,
        "backend_data": {
            "properties": pending_properties,
        }
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/admin_property/<property_id>', methods=['GET'])
@admin_required
@handle_route_exceptions
def get_admin_property_details_route(property_id):
    property_details = get_admin_property_details(property_id)
    
    response_data = {
        "success": True,
        "backend_data": property_details
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/approve_property/<property_id>', methods=['POST'])
@admin_required
@handle_route_exceptions
def approve_property_route(property_id):
    approve_pending_property(property_id)
    
    response_data = {
        "success": True,
        "message": "Property approved successfully",
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/reject_property/<property_id>', methods=['DELETE'])
@admin_required
@handle_route_exceptions
def reject_property_route(property_id):
    reject_pending_property(property_id)
    
    response_data = {
        "success": True,
        "message": "Property rejected and deleted successfully",
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/add_credit/<property_id>', methods=['POST'])
@admin_required
@handle_route_exceptions
def add_credit_balance_route(property_id):
    request_data = request.get_json()
    credit_amount = request_data.get("credit_amount")
    
    if not credit_amount or credit_amount <= 0:
        raise AppException("Valid credit amount is required")
    
    add_credit_balance(property_id, credit_amount)
    
    response_data = {
        "success": True,
        "message": "Credit balance added successfully",
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/mark_favourite/<property_id>', methods=['POST'])
@admin_required
@handle_route_exceptions
def mark_property_favourite_route(property_id):
    request_data = request.get_json()
    favourite_status = request_data.get("favourite")
    
    if favourite_status is None:
        raise AppException("Favourite status is required")
    
    if not isinstance(favourite_status, bool):
        raise AppException("Favourite status must be true or false")
    
    mark_property_as_favourite(property_id, favourite_status)
    
    action = "marked as favourite" if favourite_status else "removed from favourites"
    response_data = {
        "success": True,
        "message": f"Property {action} successfully",
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/toggle_property_status/<property_id>', methods=['POST'])
@admin_required
@handle_route_exceptions
def toggle_property_status_route(property_id):
    request_data = request.get_json()
    new_status = request_data.get("status")
    
    if not new_status:
        raise AppException("Status is required")
    
    if new_status not in ['active', 'inactive']:
        raise AppException("Status must be 'active' or 'inactive'")
    
    toggle_property_status(property_id, new_status)
    
    response_data = {
        "success": True,
        "message": f"Property {new_status} successfully",
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/pending_reviews', methods=['GET'])
@admin_required
@handle_route_exceptions
def get_pending_reviews_route():
    pending_reviews = get_pending_reviews()
    
    response_data = {
        "success": True,
        "backend_data": {
            "pending_reviews": pending_reviews
        }
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/accept_comment/<review_id>', methods=['POST'])
@admin_required
@handle_route_exceptions
def accept_comment_route(review_id):
    accept_pending_review(review_id)
    
    response_data = {
        "success": True,
        "message": "Review accepted and moved to farmhouse successfully"
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/reject_comment/<review_id>', methods=['DELETE'])
@admin_required
@handle_route_exceptions
def reject_comment_route(review_id):
    reject_pending_review(review_id)
    
    response_data = {
        "success": True,
        "message": "Review rejected and deleted successfully"
    }
    
    return jsonify(response_data), 200



@admin_bp.route('/admin_all_properties', methods=['GET'])
@admin_required
@handle_route_exceptions
def get_all_properties_route():
    all_properties = get_all_properties()
    
    response_data = {
        "success": True,
        "backend_data": {
            "properties": all_properties,
            "total_count": len(all_properties)
        }
    }

    return jsonify(response_data), 200


@admin_bp.route('/analytics', methods=['GET'])
@admin_required
@handle_route_exceptions
def get_admin_kpis_route():
    kpis = get_admin_dashboard_kpis()
    
    response_data = {
        "success": True,
        "backend_data": kpis
    }
    
    return jsonify(response_data), 200


@admin_bp.route('/edit_property_field/<property_id>', methods=['PUT'])
@admin_required
@handle_route_exceptions
def edit_property_field_route(property_id):
    request_data = request.get_json()
    field_name = request_data.get('field')
    value = request_data.get('value')
    
    if not field_name:
        raise AppException("Field name is required", 400)
    
    update_property_field(property_id, field_name, value)
    response_data = {
        "success": True,
        "message": "Field updated successfully"
    }
    return jsonify(response_data), 200