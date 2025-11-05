from flask import Blueprint, jsonify, request, make_response
from src.logics.owner_dashboard_logic import get_owner_dashboard_data, get_booked_dates, add_booked_date, remove_booked_date, authenticate_owner, owner_required
from src.utils.exception_handler import handle_route_exceptions, AppException


owner_bp = Blueprint('owner', __name__)


@owner_bp.route('/owner-login', methods=['POST'])
@handle_route_exceptions
def owner_login_route():
    data = request.get_json()
    owner_id = data.get('owner_id')
    password = data.get('password')
    
    if not owner_id or not password:
        raise AppException("Owner ID and password are required")
    
    auth_result = authenticate_owner(owner_id, password)
    
    response = make_response(jsonify({
        "success": True,
        "data": auth_result
    }), 200)
    
    response.set_cookie(
        'owner_token',
        auth_result['token'],
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=24 * 60 * 60
    )
    
    return response


@owner_bp.route('/owner-logout', methods=['POST'])
@handle_route_exceptions
def owner_logout_route():
    response = make_response(jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200)
    
    response.set_cookie('owner_token', '', expires=0)
    return response


@owner_bp.route('/owner-auto-login', methods=['GET'])
@owner_required
@handle_route_exceptions
def owner_auto_login():
    owner_data = request.owner
    return jsonify({
        "status": "success",
        "backend_data": {
            "owner": True,
            "farmhouse_id": owner_data.get("farmhouse_id"),
            "owner_id": owner_data.get("owner_id")
        }
    }), 200


@owner_bp.route('/owner-dashboard/<farmhouse_id>', methods=['GET'])
@owner_required
@handle_route_exceptions
def get_owner_dashboard_route(farmhouse_id):
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    
    dashboard_data = get_owner_dashboard_data(farmhouse_id)
    
    response_data = {
        "success": True,
        "backend_data": dashboard_data
    }
    
    return jsonify(response_data), 200


@owner_bp.route('/booked-dates/<farmhouse_id>', methods=['GET'])
@owner_required
@handle_route_exceptions
def get_booked_dates_route(farmhouse_id):
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    
    result = get_booked_dates(farmhouse_id)
    
    response_data = {
        "success": True,
        "data": result
    }
    
    return jsonify(response_data), 200


@owner_bp.route('/booked-dates/<farmhouse_id>', methods=['POST'])
@owner_required
@handle_route_exceptions
def add_booked_date_route(farmhouse_id):
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    
    data = request.get_json()
    date_string = data.get('date')
    
    if not date_string:
        raise AppException("Date is required")
    
    result = add_booked_date(farmhouse_id, date_string)
    
    response_data = {
        "success": True,
        "data": result
    }
    
    return jsonify(response_data), 200


@owner_bp.route('/booked-dates/<farmhouse_id>', methods=['DELETE'])
@owner_required
@handle_route_exceptions
def remove_booked_date_route(farmhouse_id):
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    
    data = request.get_json()
    date_string = data.get('date')
    
    if not date_string:
        raise AppException("Date is required")
    
    result = remove_booked_date(farmhouse_id, date_string)
    
    response_data = {
        "success": True,
        "data": result
    }
    
    return jsonify(response_data), 200
