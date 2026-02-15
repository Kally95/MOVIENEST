import secrets

class Config():
  SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
  JWT_SECRET_KEY = secrets.token_hex(32)