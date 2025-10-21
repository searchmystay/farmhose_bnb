from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(app,
         origins="*",
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
         max_age=3600
     )

    return app
