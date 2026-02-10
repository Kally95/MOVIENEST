from flask import Blueprint, jsonify

from model.list import ListModel

blp = Blueprint("lists", __name__, prefix="/lists")


@blp.route("/", methods=["GET"])
def lists():
  user_id = 1
  all_lists = ListModel.query.filter_by(user_id=user_id).all()
  return jsonify(all_lists)
