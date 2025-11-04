from flask import Blueprint, jsonify, request
from src.logics.owner_dashboard_logic import get_owner_dashboard_data, get_booked_dates, add_booked_date, remove_booked_date
from src.utils.exception_handler import handle_route_exceptions, AppException


owner_bp = Blueprint('owner', __name__)


@owner_bp.route('/owner-dashboard/<farmhouse_id>', methods=['GET'])
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
