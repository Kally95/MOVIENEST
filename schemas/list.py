from marshmallow import Schema, fields
from model.list import ListVisibility, ListType

class ListSchema(Schema):
  id = fields.Int(dump_only=True)
  name = fields.Str(required=True)
  visibility = fields.Enum(ListVisibility, required=True)
  user_id = fields.Int(dump_only=True)
  list_type = fields.Enum(ListType, dump_only=True, allow_none=True)
  
list_schema = ListSchema()