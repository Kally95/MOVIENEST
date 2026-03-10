from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from errors import register_error_handlers
from extensions import migrate
from db import db
from config import Config
from routes.auth import blp as AuthBlueprint
from routes.list import blp as ListBlueprint
from blocklist import BLOCKLIST


def create_app(db_url=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    if db_url:
        app.config["SQLALCHEMY_DATABASE_URI"] = db_url

    db.init_app(app)

    jwt = JWTManager(app)

    migrate.init_app(app, db)

    register_error_handlers(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({
                "description": "The token has been revoked",
                "error": "token_revoked",
            }),
            401,
        )
        
    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return (
            jsonify({
                "description": "The token is not fresh",
                "error": "fresh_token_required"
            }), 
            401
        )

    app.register_blueprint(AuthBlueprint, url_prefix="/api/auth")
    app.register_blueprint(ListBlueprint, url_prefix="/api/lists")

    return app