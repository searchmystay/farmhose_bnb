import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'farmhouse_listing')

R2_ENDPOINT_URL = "https://aaddbda4e129b5df368b56070cfeb027.r2.cloudflarestorage.com"
R2_BUCKET_NAME = "farmhouse-listing-bucket"
R2_PUBLIC_URL = "https://pub-b4a38eaa745f44c4bac6b1f606453d02.r2.dev"
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')

LEAD_COST_RUPEES = 40
MINIMUM_BALANCE_THRESHOLD = -500

MAX_SEARCH_DISTANCE_KM = 50

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
VECTOR_STORE_ID = os.getenv('VECTOR_STORE_ID')

RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
AUTO_PAYMENT_THRESHOLD = 200
AUTO_PAYMENT_AMOUNT = 500

# Property Registration Settings
MINIMUM_PROPERTY_ACTIVATION_AMOUNT = 1000

OTP_EXPIRY_MINUTES = 10
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')