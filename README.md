# Fleet Monitoring Platform

A full-stack fleet monitoring application that simulates vehicle movement, visualizes fleet locations, tracks vehicle history, and identifies operational alerts.

## Overview

The Fleet Monitoring Platform is a software project designed to demonstrate how vehicle telemetry can be collected, processed, stored, and displayed through a web-based dashboard.

A Python simulator generates vehicle updates, a FastAPI backend processes the data, and PostgreSQL stores current vehicle information and historical records. The frontend presents fleet information on an interactive map and provides access to monitoring and alert data.

## Features

- **Vehicle tracking:** View vehicle locations, speeds, and headings.
- **Interactive map:** Visualize vehicle positions using React and Leaflet.
- **Simulated telemetry:** Generate continuous vehicle updates through a Python simulator.
- **Vehicle history:** Store and retrieve historical location and speed records.
- **Fleet overview:** Retrieve current vehicle information and associated history through a single API endpoint.
- **Operational alerts:** Identify overspeeding, prolonged stops, and geofence violations.
- **REST API:** Provide endpoints for vehicle updates, fleet data, history, and alerts.
- **Automated tests:** Test API responses, vehicle updates, alert behavior, and invalid input.

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
          | Vehicle telemetry
          v
     FastAPI Backend
          |
          v
      PostgreSQL
   Current Vehicle Data
    Historical Records
          |
          v
      React Frontend
     + Leaflet Map
          |
          v
  Fleet Monitoring Dashboard
```

The simulator generates vehicle updates and sends them to the backend. The backend validates incoming data, updates the database, and records vehicle history. The frontend retrieves fleet information and displays it for monitoring.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns an API status message. |
| GET | `/vehicles` | Retrieves current vehicle data. |
| POST | `/update` | Processes a vehicle telemetry update. |
| GET | `/history/{vehicle_id}` | Retrieves historical records for a vehicle. |
| GET | `/fleet` | Retrieves current fleet data and recent vehicle histories. |
| GET | `/alerts` | Retrieves detected operational alerts. |

## Automated Testing

The backend includes an automated test suite covering the primary API functionality.

Current test coverage includes:

- API root response and vehicle retrieval.
- Successful and unsuccessful vehicle updates.
- Overspeed, prolonged-stop, and geofence alerts.
- Validation of missing and invalid request fields.
- Fleet data and vehicle history responses.

Run the tests from the `backend` directory with the project virtual environment activated:

```bash
python -m pytest -v
```

**Current result:** 11 tests passing.

The current automated tests use mocked database connections. Testing against a live PostgreSQL database is a separate integration verification step.

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

The application requires Python, Node.js/npm, and PostgreSQL. Each component must be configured before the complete application can run.

### 1. Clone the repository

```bash
git clone https://github.com/EKroboth5295/fleet-monitoring-platform.git
cd fleet-monitoring-platform
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows Git Bash:

```bash
source venv/Scripts/activate
```

Install the backend dependencies:

```bash
python -m pip install -r requirements.txt
```

Configure the PostgreSQL connection using the environment variables expected by the backend. Ensure the database and required tables are initialized before starting the application.

Start the API from the `backend` directory:

```bash
uvicorn main:app --reload
```

The API should be available at `http://127.0.0.1:8000`. FastAPI's interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Set up the frontend and simulator

Install the frontend dependencies using the frontend project's package configuration, then start the development server using its configured script.

Configure the simulator to send vehicle updates to the running backend, then start the simulator from its project directory.

Refer to the frontend and simulator configuration files for their exact startup commands and required settings.

## Future Improvements

Potential future work includes deployment, additional integration testing, improved error handling, and further enhancements to the fleet dashboard.

## Author

**Evan Kroboth**

- [LinkedIn](https://www.linkedin.com/in/evan-kroboth/)
- [Portfolio](https://sites.psu.edu/ekroboth/)
