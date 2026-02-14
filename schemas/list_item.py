from marshmallow import Schema, fields

class ListItemSchema(Schema):  
  id = fields.Int(dump_only=True)
  movie_id = fields.Int(required=True)
  list_id = fields.Int(required=True, dump_only=True)
  
  
list_item_schema = ListItemSchema