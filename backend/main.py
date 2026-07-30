import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

conn = psycopg.connect(
    dbname="fleet_monitoring",
    user="postgres",
    password="JoejoeFreddy9321!",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

print("Connected to PostgreSQL!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VehicleUpdate(BaseModel):
    id: int
    lat: float
    lon: float
    speed: float

@app.post("/update")
def update_vehicle(vehicle: VehicleUpdate):

    cursor.execute(
        """
        UPDATE vehicles
        SET latitude = %s,
            longitude = %s,
            speed = %s
        WHERE id = %s
        """,
        (
            vehicle.lat,
            vehicle.lon,
            vehicle.speed,
            vehicle.id
        )
    )

    if cursor.rowcount == 0:
        return {"error": "Vehicle not found"}

    cursor.execute(
        """
        INSERT INTO vehicle_history
        (vehicle_id, latitude, longitude, speed)
        VALUES (%s, %s, %s, %s)
        """,
        (
            vehicle.id,
            vehicle.lat,
            vehicle.lon,
            vehicle.speed
        )
    )

    conn.commit()

    return {
        "message": "Vehicle updated",
        "vehicle": vehicle
    }

@app.get("/")
def root():
    return {"message": "Fleet Monitoring API"}

@app.get("/vehicles")
def get_vehicles():

    cursor.execute(
        """
        SELECT id, latitude, longitude, speed
        FROM vehicles
        """
    )

    rows = cursor.fetchall()

    vehicles = []

    for row in rows:
        vehicles.append(
            {
                "id": row[0],
                "lat": row[1],
                "lon": row[2],
                "speed": row[3]
            }
        )

    return vehicles

@app.get("/history/{vehicle_id}")
def get_history(vehicle_id: int):
    cursor.execute(
        """
        SELECT latitude,
               longitude,
               speed,
               timestamp
        FROM vehicle_history
        WHERE vehicle_id = %s
        ORDER BY timestamp
        """,
        (vehicle_id,)
    )

    rows = cursor.fetchall()

    history = []

    for row in rows:
        history.append(
            {
                "lat": row[0],
                "lon": row[1],
                "speed": row[2],
                "timestamp": row[3]
            }
        )

    return history