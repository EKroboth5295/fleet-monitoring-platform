import time
import requests
import math
import random

trucks = [
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
    },
]

for truck in trucks:
    truck["stopped"] = False
    truck["stop_time"] = 0
    truck["previous_speed"] = truck["speed"]
    
MIN_LAT = 40.790
MAX_LAT = 40.815

MIN_LON = -77.870
MAX_LON = -77.855

last_update = time.time()

while True:
    now = time.time()
    dt = now - last_update
    last_update = now

    for truck in trucks:
        if not truck["stopped"] and random.random() < 0.02:
            truck["stopped"] = True
            truck["stop_time"] = random.uniform(6, 9)
            truck["previous_speed"] = truck["speed"]

        if truck["stopped"]:
            truck["speed"] = 0
            truck["stop_time"] -= dt

            if truck["stop_time"] <= 0:
                truck["stopped"] = False
                truck["stop_time"] = 0
                truck["speed"] = truck["previous_speed"]

        else:
            truck["speed"] += random.uniform(-0.2, 0.2)
            truck["speed"] = max(15, min(65, truck["speed"]))

            if random.random() < 0.1:
                truck["heading"] += random.uniform(-10, 10)
                truck["heading"] %= 360

            meters = truck["speed"] * 0.44704 * dt

            heading = math.radians(truck["heading"])

            north = meters * math.cos(heading)
            east = meters * math.sin(heading)

            truck["lat"] += north / 111320
            truck["lon"] += east / (
                111320 * math.cos(math.radians(truck["lat"]))
            )

            if truck["lat"] < MIN_LAT or truck["lat"] > MAX_LAT:
                truck["heading"] = (180 - truck["heading"]) % 360

            if truck["lon"] < MIN_LON or truck["lon"] > MAX_LON:
                truck["heading"] = (-truck["heading"]) % 360

        requests.post(
            "http://127.0.0.1:8000/update",
            json=truck
        )

        print(truck)

    print("-" * 40)   # separator between updates
    time.sleep(3)
