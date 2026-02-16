################################ TEST LIST RESOURCES ################################

def test_get_all_lists(auth_client):
  r = auth_client.get("/lists/")
  assert r.status_code == 200

  data = r.get_json()
  assert len(data) >= 2

  by_type = {item["list_type"]: item for item in data}

  assert "WATCHLIST" in by_type
  assert "FAVOURITES" in by_type

  watchlist = by_type["WATCHLIST"]
  assert watchlist["name"] == "Watchlist"
  assert watchlist["visibility"] == "PRIVATE"

  favourites = by_type["FAVOURITES"]
  assert favourites["name"] == "Favourites"
  assert favourites["visibility"] == "PRIVATE"
 

def test_get_all_lists_unauthorized(client):
  r = client.get("/lists/")
  assert r.status_code == 401

  data = r.get_json()
  assert data["msg"] == "Missing Authorization Header"
  
  
def test_get_all_lists_only_returns_current_users_lists(client):
  u1 = client.post("/auth/registration", json={
      "email": "u1@u1.com",
      "password": "pass1234",
  })
  assert u1.status_code == 201
  u1_data = u1.get_json()
  u1_id = u1_data["id"]
  token = u1_data["access_token"]

  u2 = client.post("/auth/registration", json={
    "email": "u2@u2.com",
    "password": "pass1234",
  })
  assert u2.status_code == 201
  u2_id = u2.get_json()["id"]

  r = client.get("/lists/", headers={
    "Authorization": f"Bearer {token}"
  })
  assert r.status_code == 200

  data = r.get_json()
  assert isinstance(data, list)
  assert len(data) >= 2

  assert all(item["user_id"] == u1_id for item in data)

  assert all(item["user_id"] != u2_id for item in data)


def test_list_creation_with_authenticated_user(auth_client):
  r = auth_client.post("/lists/", json={
    "name": "Test List",
    "visibility": "PUBLIC"
  })
  assert r.status_code == 201

  data = r.get_json()
  assert data["user_id"] is not None
  assert data["list_type"] == "CUSTOM"
  assert data["name"] == "Test List"
  assert data["visibility"] == "PUBLIC"

  r2 = auth_client.get(f"/lists/{data['id']}")
  assert r2.status_code == 200

  lst = r2.get_json()
  assert lst["id"] == data["id"]
  assert lst["user_id"] == data["user_id"]
  
  
def test_create_list_requires_json(auth_client):
  r = auth_client.post("/lists/")
  assert r.status_code == 400

  
def test_create_list_missing_fields(auth_client):
  r = auth_client.post("/lists/", json={})
  assert r.status_code == 400
  
def test_create_list_invalid_visibility(auth_client):
  r = auth_client.post("/lists/", json={"name": "A", "visibility": "WRONG"})
  assert r.status_code == 400
  
def test_create_list_unauthorized(client):
  r = client.post("/lists/", json={
    "name": "Test List",
    "visibility": "PUBLIC"
  })
  assert r.status_code == 401
  
def test_create_list_with_reserved_name(auth_client):
  r = auth_client.post("/lists/", json={
    "name": "Watchlist",
    "visibility": "PUBLIC"
  })
  assert r.status_code == 409
  
def test_create_list_with_duplicate_name(auth_client):
  create1 = auth_client.post("/lists/", json={
    "name": "Top 10",
    "visibility": "PUBLIC"
  })
  assert create1.status_code == 201

  create2 = auth_client.post("/lists/", json={
    "name": "Top 10",
    "visibility": "PUBLIC"
  })

  assert create2.status_code == 409

  data = create2.get_json()
  assert "error" in data
  
  
################################ TEST LIST RESOURCES BY ID ################################


