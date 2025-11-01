from bson import ObjectId
from datetime import datetime
from . import db
from .db_common_operations import db_insert_one, db_find_one, db_update_one, db_increment_field
from ..utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def create_payment_record(farmhouse_id, amount):
    payment_data = {
        "farmhouse_id": ObjectId(farmhouse_id),
        "amount": amount,
        "status": "initiated",
        "created_at": datetime.utcnow()
    }
    
    result = db_insert_one("payments", payment_data)
    payment_id = str(result.inserted_id)
    return payment_id


@handle_exceptions
def update_payment_order_id(payment_id, order_id):
    filter_dict = {"_id": ObjectId(payment_id)}
    update_dict = {"$set": {"order_id": order_id}}
    
    result = db_update_one("payments", filter_dict, update_dict)
    
    if result.modified_count == 0:
        raise AppException("Failed to update payment with order ID")
    
    return True


@handle_exceptions
def get_payment_by_order_id(order_id):
    filter_dict = {"order_id": order_id}
    payment_data = db_find_one("payments", filter_dict)
    
    if not payment_data:
        raise AppException("Payment not found for given order ID")
    
    return payment_data


@handle_exceptions
def update_payment_success(order_id, payment_id, signature):
    filter_dict = {"order_id": order_id}
    update_dict = {
        "$set": {
            "payment_id": payment_id,
            "signature": signature,
            "status": "success",
            "verified_at": datetime.utcnow()
        }
    }
    
    result = db_update_one("payments", filter_dict, update_dict)
    
    if result.modified_count == 0:
        raise AppException("Failed to update payment status")
    
    return True


@handle_exceptions
def update_payment_failed(order_id):
    filter_dict = {"order_id": order_id}
    update_dict = {"$set": {"status": "failed"}}
    
    result = db_update_one("payments", filter_dict, update_dict)
    return result.modified_count > 0


@handle_exceptions
def add_credits_to_farmhouse(farmhouse_id, credit_amount):
    filter_dict = {"_id": ObjectId(farmhouse_id)}
    
    result = db_increment_field("farmhouses", filter_dict, "credit_balance", credit_amount)
    
    if not result:
        raise AppException("Failed to add credits to farmhouse")
    
    return True


@handle_exceptions
def get_farmhouse_credit_balance(farmhouse_id):
    filter_dict = {"_id": ObjectId(farmhouse_id)}
    projection = {"credit_balance": 1}
    
    farmhouse_data = db_find_one("farmhouses", filter_dict, projection)
    
    if not farmhouse_data:
        raise AppException("Farmhouse not found")
    
    credit_balance = farmhouse_data.get("credit_balance", 0)
    return credit_balance
