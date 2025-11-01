from flask import Blueprint, jsonify
from src.logics.owner_dashboard_logic import get_owner_dashboard_data
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
