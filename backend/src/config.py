import os

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'farmhouse_listing')

R2_ENDPOINT_URL = "https://your-account-id.r2.cloudflarestorage.com"
R2_BUCKET_NAME = "farmhouse-listing-bucket"
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')

LEAD_COST_RUPEES = 40
MINIMUM_BALANCE_THRESHOLD = 500

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')