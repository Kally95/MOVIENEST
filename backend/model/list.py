from db import db
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum
from sqlalchemy import Enum as SQLEnum

class ListVisibility(Enum):
  PUBLIC = "public"
  PRIVATE = "private"
  
class ListType(Enum):
  WATCHLIST = "watchlist"
  FAVOURITES = "favourites"
  CUSTOM = "custom"

class ListModel(db.Model):
  __tablename__ = "lists"
  
  id: Mapped[int] = mapped_column(primary_key=True)
  name: Mapped[str] = mapped_column(db.String(255), nullable=False)
  
  visibility: Mapped[ListVisibility] = mapped_column(
    SQLEnum(ListVisibility, name="list_visibility"),
    nullable=False,
    default=ListVisibility.PUBLIC,
  )
  
  user_id: Mapped[int] = mapped_column(
    db.ForeignKey("users.id"),
    nullable=False,
    index=True 
  )
  
  list_type: Mapped[ListType] = mapped_column(
    SQLEnum(ListType, name="list_type"),
    nullable=False,
    default=ListType.CUSTOM,
    index=True,
  )

  __table_args__ = (
    db.UniqueConstraint("user_id", "name", name="uq_user_list_name"),
  )
  
  def __repr__(self) -> str:
    return f"<List id={self.id} name={self.name} visibility={self.visibility} user_id={self.user_id} list_Type={self.list_type}>"
