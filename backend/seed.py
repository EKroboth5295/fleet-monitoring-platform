import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

vehicles = [
    {
        "id": 1,
        "lat": 40.798,
        "lon": -77.860,
        "speed": 35,
        "heading": 25
    },
    {
        "id": 2,
        "lat": 40.799,
        "lon": -77.859,
        "speed": 42,
        "heading": 70
    },
    {
        "id": 3,
        "lat": 40.800,
        "lon": -77.858,
        "speed": 28,
        "heading": 115
    },
    {
        "id": 4,
        "lat": 40.801,
        "lon": -77.857,
        "speed": 51,
        "heading": 160
    },
    {
        "id": 5,
        "lat": 40.802,
        "lon": -77.856,
        "speed": 39,
        "heading": 205
    },
    {
        "id": 6,
        "lat": 40.797,
        "lon": -77.861,
        "speed": 36,
        "heading": 250
    },
    {
        "id": 7,
        "lat": 40.796,
        "lon": -77.862,
        "speed": 38,
        "heading": 295
    },
    {
        "id": 8,
        "lat": 40.795,
        "lon": -77.863,
        "speed": 54,
        "heading": 340
    },
    {
        "id": 9,
        "lat": 40.794,
        "lon": -77.864,
        "speed": 45,
        "heading": 45
    },
    {
        "id": 10,
        "lat": 40.793,
        "lon": -77.865,
        "speed": 44,
        "heading": 90
    },
    {
        "id": 11,
        "lat": 40.798,
        "lon": -77.862,
        "speed": 41,
        "heading": 135
    },
    {
        "id": 12,
        "lat": 40.794,
        "lon": -77.863,
        "speed": 49,
        "heading": 180
    },
    {
        "id": 13,
        "lat": 40.799,
        "lon": -77.865,
        "speed": 47,
        "heading": 225
    },
    {
        "id": 14,
        "lat": 40.803,
        "lon": -77.862,
        "speed": 43,
        "heading": 270
    },
    {
        "id": 15,
        "lat": 40.814,
        "lon": -77.865,
        "speed": 51,
        "heading": 315
    },
    {
        "id": 16,
        "lat": 40.796,
        "lon": -77.865,
        "speed": 34,
        "heading": 15
    },
    {
        "id": 17,
        "lat": 40.795,
        "lon": -77.862,
        "speed": 42,
        "heading": 60
    },
    {
        "id": 18,
        "lat": 40.793,
        "lon": -77.864,
        "speed": 41,
        "heading": 120
    },
    {
        "id": 19,
        "lat": 40.798,
        "lon": -77.865,
        "speed": 37,
        "heading": 210
    },
    {
        "id": 20,
        "lat": 40.795,
        "lon": -77.868,
        "speed": 38,
        "heading": 300
    }
]

conn = psycopg.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cursor = conn.cursor()


for vehicle in vehicles:
    cursor.execute(
        """
        INSERT INTO vehicles (id, latitude, longitude, speed, heading)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            vehicle["id"],
            vehicle["lat"],
            vehicle["lon"],
            vehicle["speed"],
            vehicle["heading"]
        )
    )


conn.commit()

cursor.close()
conn.close()

print("Seed completed!")