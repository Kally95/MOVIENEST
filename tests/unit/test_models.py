# from model.list_item import ListItemModel
# from model.list import ListModel, ListType, ListVisibility
# from model.user import UserModel
# from passlib.hash import pbkdf2_sha256

# def test_new_user():
#   # GIVEN a User model
#   # WHEN a new User is created
#   # THEN check the email, hashed_password, and role fields are defined correctly
#   email="test@test.com"
#   password_hash=pbkdf2_sha256.hash("12345")
  
#   user = UserModel(
#     email=email,
#     password_hash=password_hash
#   )
                   
#   assert user.email == "test@test.com"
#   assert user.password_hash == pbkdf2_sha256.verify("12345")
  
# def test_new_list_item():
#   # Arrange
#   movie_id = "ABCD123"
#   list_id = 1


#   # Act
#   list_item = ListItemModel(
#     movie_id=movie_id,
#     list_id=list_id,
#   )

#   # Assert
#   assert list_item.movie_id == movie_id
#   assert list_item.list_id == list_id

  
# def test_new_list():
#   # Arrange
#   name = "Top 10"
#   visibility = ListVisibility.PUBLIC
#   list_type = ListType.WATCHLIST
#   user_id = 1

#   # Act
#   lst = ListModel(
#       name=name,
#       visibility=visibility,
#       list_type=list_type,
#       user_id=user_id
#   )

#   # Assert
#   assert lst.name == name
#   assert lst.visibility == visibility
#   assert lst.list_type == list_type
#   assert lst.user_id == user_id