def test_registration_with_empty_json(client):
  res = client.post("/auth/registration", json={})
  assert res.status_code == 400
  data = res.get_json()
  assert data["errors"]["email"][0] ==  "Missing data for required field."
  assert data["errors"]["password"][0] ==  "Missing data for required field."
  
def test_registration_requires_json_body(client):
  res = client.post("/auth/registration", data="not json", content_type="text/plain")
  assert res.status_code == 400
  data = res.get_json()
  assert data["error"] == "Bad Request"
  assert data["message"] == "Request body must be JSON"
  
def test_registration_with_valid_body(client):
  test_user = {
    "email": "test@test.com",
    "password": "12345"
  }
  
  res = client.post("/auth/registration", json=test_user)
  assert res.status_code == 201
  
  data = res.get_json()
  assert "id" in data
  assert data["email"] == test_user["email"]
  assert "access_token" in data
  
def test_registration_duplicate_email(client):
  first_signup = client.post("/auth/registration", json={
    "email": "test@test.com",
    "password": "12345"
  })
  assert first_signup.status_code == 201
  second_signup = client.post("/auth/registration", json={
    "email": "test@test.com",
    "password": "12345"
  })
  assert second_signup.status_code == 409
  data = second_signup.get_json()
  assert data["error"] == "Conflict"
  assert data["message"] == "This email already exists"