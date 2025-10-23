import os

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'farmhouse_listing')