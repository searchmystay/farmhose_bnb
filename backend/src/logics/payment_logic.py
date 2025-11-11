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
def get_or_create_razorpay_customer(farmhouse_id):
    from bson import ObjectId
    from src.database import db
    
    farmhouse = db.farmhouses.find_one({"_id": ObjectId(farmhouse_id)})
    
    if not farmhouse:
        raise AppException("Farmhouse not found")
    
    payment_method = farmhouse.get('payment_method', {})
    existing_customer_id = payment_method.get('razorpay_customer_id')
    
    if existing_customer_id:
        return existing_customer_id
    
    razorpay_client = create_razorpay_client()
    
    phone_number = farmhouse.get('phone_number', '')
    owner_name = farmhouse.get('owner_details', {}).get('name', 'Owner')
    
    customer_data = {
        "name": owner_name,
        "contact": phone_number,
        "fail_existing": "0"
    }
    
    customer = razorpay_client.customer.create(data=customer_data)
    customer_id = customer.get('id')
    
    return customer_id


@handle_exceptions
def initiate_payment_order(farmhouse_id, amount):
    payment_id = create_payment_record(farmhouse_id, amount)
    
    customer_id = get_or_create_razorpay_customer(farmhouse_id)
    
    razorpay_client = create_razorpay_client()
    order_data = {
        "amount": int(amount * 100),
        "currency": "INR",
        "receipt": f"receipt_{payment_id}",
        "customer_id": customer_id
    }
    
    razorpay_order = razorpay_client.order.create(data=order_data)
    order_id = razorpay_order.get("id")
    
    update_payment_order_id(payment_id, order_id)
    
    order_response = {
        "order_id": order_id,
        "amount": amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "customer_id": customer_id
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
def fetch_payment_details_from_razorpay(payment_id):
    razorpay_client = create_razorpay_client()
    payment_details = razorpay_client.payment.fetch(payment_id)
    return payment_details


@handle_exceptions
def extract_and_save_payment_method(farmhouse_id, payment_id):
    payment_details = fetch_payment_details_from_razorpay(payment_id)
    
    method = payment_details.get('method')
    customer_id = payment_details.get('customer_id')
    card = payment_details.get('card', {})
    upi = payment_details.get('upi', {})
    
    if not customer_id:
        return False
    
    payment_type = method
    token = payment_details.get('token_id')
    
    if not token:
        token = f"manual_{payment_id}"
    
    save_payment_method_details(farmhouse_id, customer_id, token, payment_type, payment_id)
    return True


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
    
    extract_and_save_payment_method(farmhouse_id, payment_id)
    
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


@handle_exceptions
def process_auto_recharge_payment(farmhouse_id):
    from bson import ObjectId
    from src.database import db
    from datetime import datetime
    import logging
    
    logger = logging.getLogger(__name__)
    
    farmhouse = db.farmhouses.find_one({"_id": ObjectId(farmhouse_id)})
    
    if not farmhouse:
        logger.error(f"Farmhouse not found: {farmhouse_id}")
        return False
    
    payment_method = farmhouse.get('payment_method', {})
    
    if not payment_method.get('auto_recharge_enabled'):
        logger.info(f"Auto-recharge disabled for: {farmhouse_id}")
        return False
    
    razorpay_token = payment_method.get('razorpay_token')
    if not razorpay_token:
        logger.warning(f"No payment token for: {farmhouse_id}")
        return False
    
    try:
        razorpay_client = create_razorpay_client()
        
        payment_response = razorpay_client.payment.createRecurring({
            "amount": int(AUTO_PAYMENT_AMOUNT * 100),
            "currency": "INR",
            "token": razorpay_token
        })
        
        payment_id = payment_response.get('id')
        
        db.payments.insert_one({
            "farmhouse_id": ObjectId(farmhouse_id),
            "payment_id": payment_id,
            "order_id": None,
            "signature": None,
            "verified": True,
            "status": "success",
            "amount": AUTO_PAYMENT_AMOUNT,
            "type": "auto_recharge",
            "created_at": datetime.utcnow()
        })
        
        db.farmhouses.update_one(
            {"_id": ObjectId(farmhouse_id)},
            {
                "$inc": {
                    "credit_balance": AUTO_PAYMENT_AMOUNT,
                    "payment_method.total_auto_recharges": 1
                },
                "$set": {
                    "payment_method.last_auto_recharge_date": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Auto-recharge success: {farmhouse_id} ₹{AUTO_PAYMENT_AMOUNT}")
        return True
        
    except Exception as e:
        logger.error(f"Auto-recharge failed: {farmhouse_id} - {str(e)}")
        
        db.payments.insert_one({
            "farmhouse_id": ObjectId(farmhouse_id),
            "payment_id": None,
            "order_id": None,
            "signature": None,
            "verified": False,
            "status": "failed",
            "amount": AUTO_PAYMENT_AMOUNT,
            "type": "auto_recharge",
            "error": str(e),
            "created_at": datetime.utcnow()
        })
        
        return False


@handle_exceptions
def trigger_auto_recharge_in_background(farmhouse_id):
    from apscheduler.schedulers.background import BackgroundScheduler
    
    scheduler = BackgroundScheduler()
    scheduler.start()
    
    scheduler.add_job(
        process_auto_recharge_payment,
        args=[farmhouse_id],
        id=f'auto_recharge_{farmhouse_id}',
        replace_existing=True
    )
    
    return True


@handle_exceptions
def save_payment_method_details(farmhouse_id, customer_id, token, payment_type, payment_id):
    from bson import ObjectId
    from src.database import db
    from datetime import datetime
    
    payment_method_data = {
        "razorpay_customer_id": customer_id,
        "razorpay_token": token,
        "payment_type": payment_type,
        "auto_recharge_enabled": True,
        "consent_given": True,
        "consent_timestamp": datetime.utcnow(),
        "first_payment_id": payment_id,
        "last_auto_recharge_date": None,
        "total_auto_recharges": 0
    }
    
    result = db.farmhouses.update_one(
        {"_id": ObjectId(farmhouse_id)},
        {"$set": {"payment_method": payment_method_data}}
    )
    
    if result.modified_count == 0:
        raise AppException("Failed to save payment method")
    
    return True
