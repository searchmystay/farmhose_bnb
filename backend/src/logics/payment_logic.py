import razorpay
import hmac
import hashlib
from src.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, AUTO_PAYMENT_THRESHOLD, AUTO_PAYMENT_AMOUNT
from src.database.db_payment_operations import create_payment_record, update_payment_order_id, get_payment_by_order_id, update_payment_success, update_payment_failed, add_credits_to_farmhouse, get_farmhouse_credit_balance
from src.utils.exception_handler import handle_exceptions, AppException


@handle_exceptions
def create_razorpay_client():
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    return client


@handle_exceptions
def initiate_payment_order(farmhouse_id, amount):
    payment_id = create_payment_record(farmhouse_id, amount)
    
    razorpay_client = create_razorpay_client()
    order_data = {
        "amount": int(amount * 100),
        "currency": "INR",
        "receipt": f"receipt_{payment_id}"
    }
    
    razorpay_order = razorpay_client.order.create(data=order_data)
    order_id = razorpay_order.get("id")
    
    update_payment_order_id(payment_id, order_id)
    
    order_response = {
        "order_id": order_id,
        "amount": amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID
    }
    
    return order_response


@handle_exceptions
def verify_razorpay_signature(order_id, payment_id, signature):
    message = f"{order_id}|{payment_id}"
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    is_valid = hmac.compare_digest(generated_signature, signature)
    return is_valid


@handle_exceptions
def process_payment_success(order_id, payment_id, signature):
    is_signature_valid = verify_razorpay_signature(order_id, payment_id, signature)
    
    if not is_signature_valid:
        raise AppException("Invalid payment signature")
    
    payment_data = get_payment_by_order_id(order_id)
    farmhouse_id = str(payment_data.get("farmhouse_id"))
    amount = payment_data.get("amount")
    
    update_payment_success(order_id, payment_id, signature)
    add_credits_to_farmhouse(farmhouse_id, amount)
    
    return True


@handle_exceptions
def handle_payment_failure(order_id):
    result = update_payment_failed(order_id)
    return result


@handle_exceptions
def check_and_trigger_auto_payment(farmhouse_id):
    current_balance = get_farmhouse_credit_balance(farmhouse_id)
    
    if current_balance < AUTO_PAYMENT_THRESHOLD:
        order_response = initiate_payment_order(farmhouse_id, AUTO_PAYMENT_AMOUNT)
        return order_response
    
    return None
