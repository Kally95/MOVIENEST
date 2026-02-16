import pytest
from app import create_app
from db import db

# Fixture - Something that is available to every test that you write
@pytest.fixture()
def app():
  app = create_app("sqlite://")
  
  with app.app_context():
    db.create_all()
    
  yield app
  
@pytest.fixture()
def client(app):
  return app.test_client()

@pytest.fixture()
def registered_user(client):
  r = client.post("/auth/registration", json={
    "email": "test@test.com",
    "password": "pass1234",
  })
  assert r.status_code == 201

  return {
    "email": "test@test.com",
    "password": "pass1234"
  }
  
@pytest.fixture()
def access_token(client, registered_user):
  res = client.post("/auth/login", json=registered_user)
  assert res.status_code == 200
  return res.get_json()["access_token"]

@pytest.fixture()
def auth_client(client, access_token):
  client.environ_base["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
  return client