import functools
from .logger import logger
from flask import jsonify


class AppException(Exception):
    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code


def handle_exceptions(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AppException as e:
            logger.error(f"AppException in {func.__name__}: {str(e.message)}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            raise e
    return wrapper


def handle_route_exceptions(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AppException as e:
            logger.error(f"AppException in {func.__name__}: {e.message}")
            return jsonify({"success": False, "message": e.message}), e.status_code
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            return jsonify({"success": False, "message": "Something went wrong on our side. We're on it! Please try again soon."}), 500
    return wrapper