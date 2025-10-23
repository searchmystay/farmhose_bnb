from src.logics.admin_auth import authenticate_super_admin
from src.utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def process_admin_login(login_data):
    password = login_data.get("password")
    
    if not password:
        raise AppException("Password is required")
    
    auth_result = authenticate_super_admin(password)
    
    login_response = {
        "message": "Login successful",
        "token": auth_result.get("token"),
        "expires_in": auth_result.get("expires_in"),
        "superadmin": auth_result.get("superadmin")
    }
    
    return login_response