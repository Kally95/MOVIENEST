import os
class Config:
  SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///app.db")
  JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-only-change-me")
