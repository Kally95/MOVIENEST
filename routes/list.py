from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from model.list import ListModel
from model.user import UserModel
from schemas.list import list_schema

blp = Blueprint("lists", __name__, url_prefix="/lists")

@blp.route("/", methods=["GET"])
@jwt_required()
def lists():
  current_user = get_jwt_identity()
  all_lists = ListModel.query.filter_by(user_id=current_user).all()
  return jsonify(list_schema.dump(all_lists))
