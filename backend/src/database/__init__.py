from pymongo import MongoClient
from src.config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

farmhouses_collection = db.farmhouses
admin_users_collection = db.admin_users
lead_logs_collection = db.lead_logs
credit_transactions_collection = db.credit_transactions