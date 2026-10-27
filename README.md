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
| Mapping | Leaflet |
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

The simulator sends vehicle updates to the backend, which updates the current vehicle data and records history in PostgreSQL. The frontend communicates with the API to display vehicle locations and retrieve fleet information and alerts.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns an API status message. |
| GET | `/vehicles` | Retrieves current vehicle data. |
| POST | `/update` | Processes a vehicle telemetry update. |
| GET | `/history/{vehicle_id}` | Retrieves history for a specific vehicle. |
| GET | `/fleet` | Retrieves current fleet data and recent vehicle histories. |
| GET | `/alerts` | Retrieves operational alerts. |

## Automated Testing

The backend has an automated test suite covering the main API functionality, including:

- Vehicle retrieval and updates.
- Unknown vehicle handling.
- Overspeed, prolonged-stop, and geofence alerts.
- Missing or invalid request fields.
- Fleet data and vehicle history responses.

To run the tests, activate the project's virtual environment and run the following from the `backend` directory:

```bash
python -m pytest -v
```

**Current result:** 11 tests passing.

The tests use mocked database connections, so they verify API behavior without relying on a running PostgreSQL database. Testing against a live database is a separate integration check.

## Project Structure

```text
fleet-monitoring-platform/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── tests/
├── frontend/
├── simulator/
├── docs/
└── README.md
```

## Local Setup

### Prerequisites

- Python
- Node.js and npm
- PostgreSQL

The PostgreSQL database must be configured and initialized for the backend before running the complete application.

### 1. Clone the repository

```bash
git clone https://github.com/EKroboth5295/fleet-monitoring-platform.git
cd fleet-monitoring-platform
```

### 2. Activate the Python virtual environment

From the repository root, run:

```bash
source backend/venv/Scripts/activate
```

If you are setting up the project from scratch and the virtual environment does not exist yet, create it and install the backend dependencies first:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
python -m pip install -r requirements.txt
cd ..
```

Configure the PostgreSQL connection using the environment variables expected by the backend.

### 3. Start the application

Run each component in a separate terminal from the repository root, unless otherwise specified.

**Terminal 1 — Backend API**

Activate the virtual environment, then run:

```bash
cd backend
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

**Terminal 2 — Vehicle simulator**

Activate the virtual environment, then run from the repository root:

```bash
python simulator/simulator.py
```

**Terminal 3 — Frontend**

From the repository root, run:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by the frontend development server to open the dashboard.

## Future Improvements

Potential improvements include live database integration tests, deployment, and further refinements to error handling and the dashboard.

## Author

**Evan Kroboth**

- [LinkedIn](https://www.linkedin.com/in/evan-kroboth/)
- [Portfolio](https://sites.psu.edu/ekroboth/)
