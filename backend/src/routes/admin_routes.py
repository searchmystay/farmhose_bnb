from flask import Blueprint, jsonify, request, make_response
from src.logics.admin_logics import process_admin_login
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