def test_login_works(client, registered_user):
  res = client.post("/auth/login", json=registered_user)
  assert res.status_code == 200

  data = res.get_json()
  
  assert "access_token" in data
  assert "email" in data
  assert "id" in data

def test_login_fails(client, registered_user):
  res = client.post("/auth/login", json={
    "email": "fail@fail.com",
    "password": "pass1234"
  })
  assert res.status_code == 401
  
  data = res.get_json()

  assert data["error"] == "Unauthorized"
  assert data["message"] == "Invalid email or password"
