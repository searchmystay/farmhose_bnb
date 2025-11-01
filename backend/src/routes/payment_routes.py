from flask import Blueprint, jsonify, request
from src.logics.payment_logic import initiate_payment_order, process_payment_success, handle_payment_failure
from src.utils.exception_handler import handle_route_exceptions, AppException


payment_bp = Blueprint('payment', __name__)


@payment_bp.route('/create-payment-order', methods=['POST'])
@handle_route_exceptions
def create_payment_order_route():
    request_data = request.get_json()
    
    if not request_data:
        raise AppException("No data provided")
    
    farmhouse_id = request_data.get("farmhouse_id")
    amount = request_data.get("amount")
    
    if not farmhouse_id:
        raise AppException("Farmhouse ID is required")
    
    if not amount or amount <= 0:
        raise AppException("Valid payment amount is required")
    
    order_response = initiate_payment_order(farmhouse_id, amount)
    
    response_data = {
        "success": True,
        "backend_data": order_response
    }
    
    return jsonify(response_data), 200


@payment_bp.route('/payment-webhook', methods=['POST'])
@handle_route_exceptions
def payment_webhook_route():
    webhook_data = request.get_json()
    
    if not webhook_data:
        raise AppException("No webhook data received")
    
    order_id = webhook_data.get("order_id")
    payment_id = webhook_data.get("payment_id")
    signature = webhook_data.get("signature")
    status = webhook_data.get("status")
    
    if not order_id:
        raise AppException("Order ID is required")
    
    if status == "captured" or status == "success":
        if not payment_id or not signature:
            raise AppException("Payment ID and signature are required")
        
        process_payment_success(order_id, payment_id, signature)
        
        response_data = {
            "success": True,
            "message": "Payment processed successfully"
        }
        
        return jsonify(response_data), 200
    else:
        handle_payment_failure(order_id)
        
        response_data = {
            "success": False,
            "message": "Payment failed"
        }
        
        return jsonify(response_data), 200
