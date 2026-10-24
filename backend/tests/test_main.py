from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def mock_database(fetchall_results=None, rowcount=1):
    cursor = MagicMock()
    cursor.rowcount = rowcount

    if fetchall_results is not None:
        cursor.fetchall.side_effect = fetchall_results

    connection = MagicMock()
    connection.cursor.return_value.__enter__.return_value = cursor

    pool = MagicMock()
    pool.connection.return_value.__enter__.return_value = connection

    return pool, cursor

def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Fleet Monitoring API"}

def test_get_vehicles():
    pool, _ = mock_database(
        fetchall_results=[[(1, 40.8, -77.86, 45.0, 90.0)]]
    )

    with patch("main.pool", pool):
        response = client.get("/vehicles")

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "lat": 40.8,
            "lon": -77.86,
            "speed": 45.0,
            "heading": 90.0,
        }
    ]

def test_update_vehicle():
    pool, cursor = mock_database(rowcount=1)

    payload = {
        "id": 1,
        "lat": 40.8,
        "lon": -77.86,
        "speed": 45.0,
        "heading": 90.0,
    }

    with patch("main.pool", pool):
        response = client.post("/update", json=payload)

    assert response.status_code == 200
    assert response.json()["message"] == "Vehicle updated"
    assert response.json()["vehicle"] == payload
    assert cursor.execute.call_count == 2

def test_update_unknown_vehicle():
    pool, cursor = mock_database(rowcount=0)

    payload = {
        "id": 999,
        "lat": 40.8,
        "lon": -77.86,
        "speed": 45.0,
        "heading": 90.0,
    }

    with patch("main.pool", pool):
        response = client.post("/update", json=payload)

    assert response.status_code == 200
    assert response.json() == {"error": "Vehicle not found"}
    assert cursor.execute.call_count == 1

def test_get_alerts_empty():
    pool, cursor = mock_database(fetchall_results=[[], [], []])

    with patch("main.pool", pool):
        response = client.get("/alerts")

    assert response.status_code == 200
    assert response.json() == {"alerts": []}
    assert cursor.execute.call_count == 3

def test_get_alerts_overspeed():
    pool, cursor = mock_database(
        fetchall_results=[
            [(1, 75.0)],
            [],
            [],
        ]
    )

    with patch("main.pool", pool):
        response = client.get("/alerts")

    assert response.status_code == 200

    alerts = response.json()["alerts"]
    assert len(alerts) == 1
    assert alerts[0]["type"] == "overspeed"
    assert alerts[0]["vehicle_id"] == 1
    assert alerts[0]["speed"] == 75.0
    assert alerts[0]["speed_limit"] == 65

def test_get_alerts_stopped():
    pool, cursor = mock_database(
        fetchall_results=[
            [],
            [(2, 75.0)],
            [],
        ]
    )

    with patch("main.pool", pool):
        response = client.get("/alerts")

    assert response.status_code == 200

    alerts = response.json()["alerts"]
    assert len(alerts) == 1
    assert alerts[0]["type"] == "stopped"
    assert alerts[0]["vehicle_id"] == 2
    assert alerts[0]["stopped_seconds"] == 75
    assert "stopped for 75 seconds" in alerts[0]["message"]


def test_get_alerts_geofence():
    pool, cursor = mock_database(
        fetchall_results=[
            [],
            [],
            [(3, 40.820, -77.860)],
        ]
    )

    with patch("main.pool", pool):
        response = client.get("/alerts")

    assert response.status_code == 200

    alerts = response.json()["alerts"]
    assert len(alerts) == 1
    assert alerts[0]["type"] == "geofence"
    assert alerts[0]["vehicle_id"] == 3
    assert alerts[0]["latitude"] == 40.820
    assert alerts[0]["longitude"] == -77.860
    assert "outside the permitted geofence" in alerts[0]["message"]
