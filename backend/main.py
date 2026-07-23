from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

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
    print(vehicle)

    return {
        "message": "Vehicle update received",
        "vehicle": vehicle
    }

@app.get("/")
def root():
    return {"message": "Fleet Monitoring API"}

@app.get("/vehicles")
def get_vehicles():
    vehicles = [
    {
        "id": 1,
        "lat": 40.798,
        "lon": -77.860,
        "speed": 35
    },
    {
        "id": 2,
        "lat": 40.799,
        "lon": -77.859,
        "speed": 42
    },
    {
        "id": 3,
        "lat": 40.800,
        "lon": -77.858,
        "speed": 28
    },
    {
        "id": 4,
        "lat": 40.801,
        "lon": -77.857,
        "speed": 51
    },
    {
        "id": 5,
        "lat": 40.802,
        "lon": -77.856,
        "speed": 39
    },
    {
        "id": 6,
        "lat": 40.797,
        "lon": -77.861,
        "speed": 36
    },
    {
        "id": 7,
        "lat": 40.796,
        "lon": -77.862,
        "speed": 38
    },
    {
        "id": 8,
        "lat": 40.795,
        "lon": -77.863,
        "speed": 54
    },
    {
        "id": 9,
        "lat": 40.794,
        "lon": -77.864,
        "speed": 45
    },
    {
        "id": 10,
        "lat": 40.793,
        "lon": -77.865,
        "speed": 44
    },
    {
        "id": 11,
        "lat": 40.798,
        "lon": -77.862,
        "speed": 41
    },
    {
        "id": 12,
        "lat": 40.794,
        "lon": -77.863,
        "speed": 49
    },
    {
        "id": 13,
        "lat": 40.799,
        "lon": -77.865,
        "speed": 47
    },
    {
        "id": 14,
        "lat": 40.803,
        "lon": -77.862,
        "speed": 43
    },
    {
        "id": 15,
        "lat": 40.814,
        "lon": -77.865,
        "speed": 51
    },
    {
        "id": 16,
        "lat": 40.796,
        "lon": -77.865,
        "speed": 34
    },
    {
        "id": 17,
        "lat": 40.795,
        "lon": -77.862,
        "speed": 42
    },
    {
        "id": 18,
        "lat": 40.793,
        "lon": -77.864,
        "speed": 41
    },
    {
        "id": 19,
        "lat": 40.798,
        "lon": -77.865,
        "speed": 37
    },
    {
        "id": 20,
        "lat": 40.795,
        "lon": -77.868,
        "speed": 38
    }
]
    return vehicles