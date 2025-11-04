from flask import Flask
from flask_cors import CORS
from src.routes.website_routes import website_bp
from src.routes.admin_routes import admin_bp
from src.routes.payment_routes import payment_bp
from src.routes.owner_routes import owner_bp
from src.utils.scheduler import start_scheduler


def create_app():
    app = Flask(__name__)

    CORS(app,
         origins="*",
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
         max_age=3600
    )

    app.register_blueprint(website_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(owner_bp)
    
    start_scheduler()

    return app
