# Fleet Monitoring Platform

A full-stack fleet monitoring application that simulates vehicle movement, displays vehicle locations on an interactive map, stores location history, and generates operational alerts.

## Overview

I built this project to explore how vehicle telemetry can be collected, stored, and displayed in a fleet monitoring system.

A Python simulator generates vehicle updates, a FastAPI backend processes them, and PostgreSQL stores current vehicle data and historical records. The React frontend uses Leaflet to display vehicle locations and provides a dashboard for monitoring the fleet.

## Features

- **Vehicle tracking:** Display vehicle locations, speeds, and headings.
- **Interactive map:** Visualize vehicle positions using React and Leaflet.
- **Vehicle simulation:** Generate continuous vehicle updates with a Python simulator.
- **Historical tracking:** Store and retrieve previous vehicle locations and speeds.
- **Fleet overview:** Retrieve current vehicle data and recent history through a single API endpoint.
- **Operational alerts:** Detect overspeeding, prolonged stops, and geofence violations.
- **REST API:** Handle vehicle updates and provide access to fleet data, history, and alerts.
- **Automated testing:** Test API endpoints, alert behavior, vehicle updates, and invalid input.

## Technology Stack

| Component | Technologies |
|---|---|
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Database connectivity | Psycopg 3, psycopg-pool |
| Frontend | React, TypeScript |
| Mapping | Leaflet, React Leaflet |
| Simulation | Python, Requests |
| Testing | Pytest, FastAPI TestClient |

## Architecture

```text
Python Vehicle Simulator
          |
          | Vehicle updates
          v
     FastAPI Backend <------> React Frontend
          |                       |
          v                       v
      PostgreSQL             Leaflet Map
   Current Vehicle Data      Fleet Dashboard
   Historical Records
```

The simulator sends vehicle updates to the backend, which updates current vehicle data and records historical positions in PostgreSQL. The frontend communicates with the API to display vehicle locations and retrieve fleet information and alerts.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns an API status message. |
| GET | `/vehicles` | Retrieves current vehicle data. |
| POST | `/update` | Processes a vehicle telemetry update. |
| GET | `/history/{vehicle_id}` | Retrieves history for a specific vehicle. |
| GET | `/fleet` | Retrieves current fleet data and recent vehicle histories. |
| GET | `/alerts` | Retrieves operational alerts. |

Interactive API documentation is available at `/docs` when the backend is running.

## Automated Testing

The backend test suite covers the main API functionality, including:

- Vehicle retrieval and updates.
- Unknown vehicle handling.
- Overspeed, prolonged-stop, and geofence alerts.
- Missing or invalid request fields.
- Fleet data and vehicle history responses.

Run the tests from the `backend` directory with the Python virtual environment activated:

```bash
python -m pytest -v
```

**Current result: 11 tests passing.**

The tests use mocked database connections to verify API behavior without requiring a running PostgreSQL database.

## Project Structure

```text
fleet-monitoring-platform/
├── backend/
│   ├── main.py
│   ├── seed.py
│   ├── schema.sql
│   ├── .env.example
│   ├── requirements.txt
│   └── tests/
│       └── test_main.py
├── frontend/
├── simulator/
├── docs/
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.8 or a compatible Python version for the pinned dependencies.
- Node.js and npm.
- PostgreSQL with the `psql` command-line tool available.
- Git.

The following instructions use Git Bash on Windows. Commands may differ on other operating systems.

### 1. Clone the repository

```bash
git clone https://github.com/EKroboth5295/fleet-monitoring-platform.git
cd fleet-monitoring-platform
```

### 2. Create the Python environment

From the repository root:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
python -m pip install -r requirements.txt
cd ..
```

### 3. Configure the database connection

Create your local environment file from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL database name, username, password, host, and port. The example uses `fleet_monitoring` as the database name and `localhost:5432` as the connection address.

**Do not commit your actual `.env` file or database password.**

### 4. Create and initialize the database

Create the database using your PostgreSQL account:

```bash
psql -U postgres -c "CREATE DATABASE fleet_monitoring;"
```

If the database already exists, skip the creation command.

From the repository root, create the tables and index:

```bash
psql -U postgres -d fleet_monitoring -f backend/schema.sql
```

If you use a different PostgreSQL username or database name, adjust the commands accordingly.

### 5. Seed the initial vehicles

From the repository root:

```bash
cd backend
source venv/Scripts/activate
python seed.py
cd ..
```

The seed script inserts 20 initial vehicles. Run it once against a newly initialized database; rerunning it will conflict with the existing vehicle IDs.

### 6. Start the backend API

Open a terminal at the repository root, activate the virtual environment, and start the backend:

```bash
source backend/venv/Scripts/activate
cd backend
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 7. Start the vehicle simulator

Open a second terminal at the repository root:

```bash
source backend/venv/Scripts/activate
python simulator/simulator
