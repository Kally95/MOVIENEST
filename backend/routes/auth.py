from blocklist import BLOCKLIST
from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request
from db import db
from model.list import ListModel, ListType, ListVisibility
from model.user import UserModel
from passlib.hash import pbkdf2_sha256
from schemas.user import user_schema
from werkzeug.exceptions import Conflict, BadRequest, Unauthorized
from flask_jwt_extended import jwt_required, get_jwt, create_access_token, create_refresh_token, get_jwt_identity

blp = Blueprint('auth', __name__)

def normalise_email(email):
  return email.strip().lower()

@blp.route("/registration", methods=["POST"])
def registration():
  
  req = request.get_json(silent=True)
  
  if req is None:
    raise BadRequest("Request body must be JSON")
      
  user_data = user_schema.load(req)
  
  email = normalise_email(user_data["email"])
  
  email_collision = UserModel.query.filter_by(email=email).first()
  if email_collision:
    raise Conflict("This email already exists")
  
  user = UserModel(
    email=email,
    password_hash=pbkdf2_sha256.hash(user_data["password"])
  )
  
  try:
    db.session.add(user)
    db.session.flush()
    
    watchlist = ListModel(
      name = "Watchlist",
      visibility = ListVisibility.PRIVATE,
      user_id = user.id,
      list_type = ListType.WATCHLIST
    )

    favourites = ListModel(
      name = "Favourites",
      visibility = ListVisibility.PRIVATE,
      user_id = user.id,
      list_type = ListType.FAVOURITES
    )
  
    db.session.add_all([watchlist, favourites])
    db.session.commit()
  except IntegrityError:
    db.session.rollback()
    raise Conflict("This email already exists")

  access_token = create_access_token(identity=str(user.id))
  refresh_token = create_refresh_token(identity=str(user.id)) 
  
  return jsonify({"id": user.id, "email": user.email, "access_token": access_token, "refresh_token": refresh_token}), 201
  

@blp.route("/login", methods=["POST"])
def login():
  req = request.get_json(silent=True)
  
  if req is None:
    raise BadRequest("Request body must be JSON")
  
  user_data = user_schema.load(req)
  
  email = normalise_email(user_data["email"])
  
  user = UserModel.query.filter_by(email=email).first()
  
  if not user:
    raise Unauthorized("Invalid email or password")
  
  if not pbkdf2_sha256.verify(user_data["password"], user.password_hash):
    raise Unauthorized("Invalid email or password")
  
  access_token = create_access_token(identity=str(user.id), fresh=True)
  refresh_token = create_refresh_token(identity=str(user.id))
         
  return jsonify({"id": user.id, "email": user.email, "access_token": access_token, "refresh_token": refresh_token}), 200

@blp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
  jti = get_jwt()["jti"]
  BLOCKLIST.add(jti)
  return {"message": "Successfully logged out."}

@blp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    return {"access_token": new_token}