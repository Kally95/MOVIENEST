from marshmallow import Schema, fields, validate
from model.list import ListVisibility
from marshmallow.validate import OneOf

class ListSchema(Schema):
  id = fields.Int(dump_only=True)
  name = fields.Str(required=True)
  visibility = fields.Str(
    required=True,
    validate=validate.OneOf([v.name for v in ListVisibility])
  )
  user_id = fields.Int(dump_only=True)
  list_type = fields.Str(validate=OneOf(["WATCHLIST", "FAVOURITES", "CUSTOM"]))
  
list_schema = ListSchema()