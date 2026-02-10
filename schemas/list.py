from marshmallow import Schema, fields
from model.list import ListVisibility, ListType

class ListSchema(Schema):
  id = fields.Int(dump_only=True)
  name = fields.Str(required=True)
  visibility = fields.Enum(ListVisibility)
  user_id = fields.Int(dump_only=True)
  list_type = fields.Enum(ListType)