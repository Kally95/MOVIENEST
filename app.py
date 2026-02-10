from http.client import HTTPException
from flask import Flask, jsonify
from errors import register_error_handlers
from extensions import migrate
from marshmallow import ValidationError
from db import db
from config import Config
from routes.auth import blp as AuthBlueprint


def create_app(db_url = None):
  app = Flask(__name__)

  if db_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    
  db.init_app(app)
  
  migrate.init_app(app, db)
  
  app.config.from_object(Config)
  
  register_error_handlers(app)
  
  app.register_blueprint(AuthBlueprint)
  
  return app
  