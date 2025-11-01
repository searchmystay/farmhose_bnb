import razorpay
import os
from dotenv import load_dotenv

load_dotenv()

RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')

print(f"Key ID: {RAZORPAY_KEY_ID}")
print(f"Key Secret: {RAZORPAY_KEY_SECRET[:5]}... (hidden)")

try:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    print("✅ Client created successfully")
    
    # Try to create a test order
    order_data = {
        "amount": 10000,  # ₹100 in paise
        "currency": "INR",
        "receipt": "test_receipt_123"
    }
    
    order = client.order.create(data=order_data)
    print("✅ Order created successfully!")
    print(f"Order ID: {order['id']}")
    print(f"Full response: {order}")
    
except Exception as e:
    print(f"❌ Error: {type(e).__name__}")
    print(f"❌ Message: {str(e)}")
    import traceback
    print("\nFull traceback:")
    traceback.print_exc()
