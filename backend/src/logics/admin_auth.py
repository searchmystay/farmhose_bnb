import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from src.utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def validate_super_admin_password(password):
    admin_password = os.getenv('ADMIN_PASSWORD')
    
    if not admin_password:
        raise AppException("Admin password not configured")
    
    if password != admin_password:
        raise AppException("Invalid admin password")
    
    return True


@handle_exceptions
def generate_super_admin_jwt_token():
    jwt_secret = os.getenv('JWT_SECRET_KEY')
    
    if not jwt_secret:
        raise AppException("JWT secret not configured")
    
    payload = {
        "superadmin": True,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, jwt_secret, algorithm='HS256')
    return token


@handle_exceptions
def verify_super_admin_jwt_token(token):
    jwt_secret = os.getenv('JWT_SECRET_KEY')
    
    if not jwt_secret:
        raise AppException("JWT secret not configured")
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        
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
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "message": "Authorization header required"
            }), 401
        
        token = auth_header.split(' ')[1]
        
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