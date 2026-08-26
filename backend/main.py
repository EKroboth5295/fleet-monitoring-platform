import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()

conn = psycopg.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
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
    heading: float

@app.post("/update")
def update_vehicle(vehicle: VehicleUpdate):

    cursor.execute(
        """
        UPDATE vehicles
        SET latitude = %s,
            longitude = %s,
            speed = %s,
            heading = %s
        WHERE id = %s
        """,
        (
            vehicle.lat,
            vehicle.lon,
            vehicle.speed,
            vehicle.heading,
            vehicle.id
        )
    )

    if cursor.rowcount == 0:
        conn.rollback()
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
        SELECT id, latitude, longitude, speed, heading
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
                "speed": row[3],
                "heading": row[4]
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
        FROM (
            SELECT latitude,
                longitude,
                speed,
                timestamp
            FROM vehicle_history
            WHERE vehicle_id = %s
            ORDER BY timestamp DESC
            LIMIT 500
        ) AS recent_history
        ORDER BY timestamp;
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