from flask_jwt_extended import get_jwt_identity


def detect_reserved_list_name(name):
  return name.strip().lower() in {"watchlist", "favourites"}
  
def return_jwt_identity():
  return int(get_jwt_identity())