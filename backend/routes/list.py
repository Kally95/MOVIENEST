from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from model.list import ListModel, ListType, ListVisibility
from model.list_item import ListItemModel
from schemas.list import list_schema
from schemas.list_item import list_item_schema
from werkzeug.exceptions import BadRequest, Conflict, NotFound
from db import db
from sqlalchemy.exc import IntegrityError

from utility.helper import detect_reserved_list_name, return_jwt_identity

blp = Blueprint("lists", __name__)

@blp.route("/", methods=["GET"])
@jwt_required()
def get_lists():
  user_id = return_jwt_identity()
  lists = ListModel.query.filter_by(user_id=user_id).all()

  return jsonify([
    {
        "id": lst.id,
        "name": lst.name,
        "visibility": lst.visibility.name,
        "user_id": lst.user_id,
        "list_type": lst.list_type.name,
    }
    for lst in lists
  ]), 200


@blp.route("/", methods=["POST"])
@jwt_required()
def create_list():
  user_id = return_jwt_identity()
  
  req = request.get_json(silent=True)
  if req is None:
    raise BadRequest("Request body must be JSON")
  
  list_data = list_schema.load(req)
  name = list_data["name"].strip()
  
  if name.lower() == "watchlist" or name.lower() == "favourites":
    raise Conflict("List with reserved name cannot be made, choose another")
  
  if ListModel.query.filter_by(user_id=user_id, name=name).first():
    raise Conflict("A list with this name already exists")
  
  lst = ListModel(
    user_id = user_id,
    name = name,
    visibility=ListVisibility[list_data["visibility"]],
    list_type=ListType.CUSTOM,
  )
  
  try:
    db.session.add(lst)
    db.session.commit()
  except IntegrityError:
    db.session.rollback()
    raise Conflict("A list with this name already exists")

  return jsonify({
    "id": lst.id,
    "name": lst.name,
    "visibility": lst.visibility.name,
    "user_id": lst.user_id,
    "list_type": lst.list_type.name
  }), 201

################################ LIST RESOURCES BY ID ################################

@blp.route("/<int:list_id>", methods=["GET"])
@jwt_required()
def list_by_id(list_id):
  user_id = return_jwt_identity()
  
  lst = ListModel.query.filter_by(user_id=user_id, id=list_id).first()
  if not lst:
    raise NotFound("List not found")
  
  return jsonify({
    "id": lst.id,
    "name": lst.name,
    "visibility": lst.visibility.name,
    "user_id": lst.user_id,
    "list_type": lst.list_type.name
  }), 200
  
  
@blp.route("/<int:list_id>", methods=["DELETE"])
@jwt_required()
def delete_list(list_id):
  user_id = return_jwt_identity()
  
  lst = ListModel.query.filter_by(id=list_id, user_id=user_id).first()
  if not lst:
    raise NotFound("List not found")
  
  db.session.delete(lst)
  db.session.commit()
  
  return "", 204


@blp.route("/<int:list_id>", methods=["PUT"])
@jwt_required()
def edit_list(list_id):
  user_id = return_jwt_identity()
  req = request.get_json()
  list_data = list_schema.load(req)
  
  lst = ListModel.query.filter_by(id=list_id, user_id=user_id).first()
  if not lst:
    raise NotFound("List not found")
  
  if ListModel.query.filter_by(id=list_id, name=list_data["name"]).first():
    raise Conflict("A list with this name already exists")

  if detect_reserved_list_name(list_data["name"]):
    raise Conflict("‘Watchlist’ and ‘Favourites’ are reserved names. Please choose a different list name.")
  
  lst.name = list_data["name"]
  lst.visibility = list_data.get("visibility", ListVisibility.PRIVATE)
  
  db.session.commit()
  
  return jsonify({
    "id": lst.id,
    "name": lst.name,
    "visibility": lst.visibility.name,
    "user_id": lst.user_id,
    "list_type": lst.list_type.name
  }), 200

################################ LIST ITEM RESOURCES ################################

@blp.route("/<int:list_id>/items", methods=["POST"])
@jwt_required()
def create_list_item(list_id):
  user_id = return_jwt_identity()
  
  req = request.get_json()
  if req is None:
    raise BadRequest("Request body must be JSON")
  
  user_data = list_item_schema.load(req)
  
  lst = ListModel.query.filter_by(id=list_id, user_id=user_id).first()
  if not lst:
    raise NotFound("List not found")
  
  if ListItemModel.query.filter_by(list_id=lst.id, movie_id=user_data["movie_id"]).first():
    raise Conflict("A movie with this ID already exists in this list")

  list_item = ListItemModel(
    movie_id = user_data["movie_id"],
    list_id = list_id
  )
  
  db.session.add(list_item)
  db.session.commit()
  
  return jsonify(list_item_schema.dump(list_item)), 201
  
  
@blp.route("/<int:list_id>/items", methods=["GET"])
@jwt_required()
def get_list_items(list_id):
  
  user_id = return_jwt_identity()
  
  lst = ListModel.query.filter_by(user_id=user_id, id=list_id).first()
  if not lst:
    raise NotFound("List not found")
  
  list_items = ListItemModel.query.filter_by(list_id=lst.id).all()
  
  return jsonify(list_item_schema.dump(list_items, many=True))


@blp.route("/<int:list_id>/items/<int:item_id>", methods=["GET"])
@jwt_required()
def get_list_item(list_id, item_id):
  user_id = return_jwt_identity()
  
  lst = ListModel.query.filter_by(user_id=user_id, id=list_id).first()
  if not lst:
    raise NotFound("List not found")
  
  list_item = ListItemModel.query.filter_by(list_id=lst.id, id=item_id).first()
  if not list_item:
    raise NotFound("This item was not found")
  
  return jsonify(list_item_schema.dump(list_item))
  
  
@blp.route("/<int:list_id>/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_list_item(list_id, item_id):
  user_id = return_jwt_identity()
  
  item = ListItemModel.query.join(ListModel, ListItemModel.list_id == ListModel.id).filter(
    ListModel.user_id == user_id,
    ListModel.id == list_id,
    ListItemModel.id == item_id
  ).first()
  if not item:
    raise NotFound("Item not found")
  
  db.session.delete(item)
  db.session.commit()
  
  return "", 204
  