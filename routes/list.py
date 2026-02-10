from flask import Blueprint, jsonify

from model.list import ListModel
from schemas.list import list_schema

blp = Blueprint("lists", __name__, url_prefix="/lists")

@blp.route("/", methods=["GET"])
def lists():
  user_id = 1
  all_lists = ListModel.query.filter_by(user_id=user_id).all()
  return jsonify(list_schema.dump(all_lists))
