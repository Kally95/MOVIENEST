from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_jwt_extended import JWTManager
from errors import register_error_handlers
from extensions import migrate
from db import db
from config import Config
from routes.auth import blp as AuthBlueprint
from routes.list import blp as ListBlueprint

def create_app(db_url = None):
  app = Flask(__name__)
  
  app.config.from_object(Config)
  
  if db_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    
  db.init_app(app)
  jwt = JWTManager(app)
  migrate.init_app(app, db)
  
  register_error_handlers(app)
  
  app.register_blueprint(AuthBlueprint)
  app.register_blueprint(ListBlueprint)
  
  return app
  