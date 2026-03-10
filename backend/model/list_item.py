from db import db
from sqlalchemy.orm import Mapped, mapped_column


class ListItemModel(db.Model):
  __tablename__ = "list_items"
  
  id: Mapped[int] = mapped_column(primary_key=True)
  movie_id: Mapped[int] = mapped_column(nullable=False, index=True)
  list_id: Mapped[int] = mapped_column(
    db.ForeignKey("lists.id", ondelete="CASCADE"),
    nullable=False,
    index=True,
  )
  
  __table_args__ = (
    db.UniqueConstraint("list_id", "movie_id", name="uq_list_movie"),
  )
  
  def __repr__(self) -> str:
    return f"<ListItem id={self.id} list_id={self.list_id} movie_id={self.movie_id}>"
