from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_place_order():
    payload = {"symbol":"TSLA","side":"BUY","qty":1,"price":250,"order_type":"market","broker":"paper","equity":10000}
    res = client.post("/broker/place", json=payload)
    assert res.status_code == 200
    assert res.json().get("status") == "ok"
