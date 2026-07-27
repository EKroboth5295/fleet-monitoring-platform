import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

conn = psycopg.connect(
    dbname="fleet_monitoring",
    user="postgres",
    password="JoejoeDuke@1",
    host="localhost",
    port="5432"
)

conn.rollback()

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
