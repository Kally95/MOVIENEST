from db import db
from sqlalchemy.orm import Mapped, mapped_column
from flask_login import UserMixin

class UserModel(UserMixin, db.Model):
  __tablename__ = "users"
  
  id: Mapped[int] = mapped_column(primary_key=True)
  email: Mapped[str] = mapped_column(db.String(255), unique=True, nullable=False)
  password_hash: Mapped[str] = mapped_column(db.String(255), nullable=False)

  
  def __repr__(self) -> str:
    return f"<User id={self.id} email={self.email}>"
