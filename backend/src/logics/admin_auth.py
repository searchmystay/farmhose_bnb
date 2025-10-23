import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from src.utils.exception_handler import handle_exceptions, AppException
from src.config import ADMIN_PASSWORD, JWT_SECRET_KEY


@handle_exceptions
def validate_super_admin_password(password):
    if not ADMIN_PASSWORD:
        raise AppException("Admin password not configured")
    
    if password != ADMIN_PASSWORD:
        raise AppException("Invalid admin password")
    
    return True


@handle_exceptions
def generate_super_admin_jwt_token():
    if not JWT_SECRET_KEY:
        raise AppException("JWT secret not configured")
    
    payload = {
        "superadmin": True,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token


@handle_exceptions
def verify_super_admin_jwt_token(token):
    if not JWT_SECRET_KEY:
        raise AppException("JWT secret not configured")
    
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        
        if not payload.get('superadmin'):
            raise AppException("Invalid superadmin token")
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise AppException("Token has expired")
    except jwt.InvalidTokenError:
        raise AppException("Invalid token")


@handle_exceptions
def authenticate_super_admin(password):
    validate_super_admin_password(password)
    admin_token = generate_super_admin_jwt_token()
    
    auth_result = {
        "token": admin_token,
        "expires_in": 24 * 60 * 60,
        "superadmin": True
    }
    
    return auth_result


def super_admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('admin_token')
        
        if not token:
            return jsonify({
                "success": False,
                "message": "Authentication required"
            }), 401
        
        try:
            payload = verify_super_admin_jwt_token(token)
            request.admin = payload
            return f(*args, **kwargs)
            
        except AppException as e:
            return jsonify({
                "success": False,
                "message": str(e)
            }), 401
    
    return decorated_function