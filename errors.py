from flask import jsonify
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):

  @app.errorhandler(ValidationError)
  def handle_marshmallow_validation(err):
    return jsonify({"errors": err.messages}), 400

  @app.errorhandler(HTTPException)
  def handle_http_exception(err):
    return jsonify({
      "error": err.name,
      "message": err.description,
    }), err.code
