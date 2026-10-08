import { Fragment, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Polyline,
  CircleMarker,
  useMap
} from "react-leaflet";
import './App.css';

const colors = [
    "red",
    "blue",
    "green",
    "orange",
    "goldenrod",
    "purple",
    "brown",
    "black",
    "magenta",
    "teal"
];

type Vehicle = {
  id: number;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
};

type HistoryPoint = {
    lat: number;
    lon: number;
    speed: number;
    timestamp: string;
};

function MapController({
  selectedTruck
}: {
  selectedTruck: Vehicle | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedTruck) {
      map.flyTo(
        [selectedTruck.lat, selectedTruck.lon],
        map.getZoom(),
        {
          duration: 1
        }
      );
    }
  }, [selectedTruck, map]);

  return null;
}

function MapClickHandler({
  setSelectedTruck
}: {
  setSelectedTruck: (id: number | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleMapClick = () => {
      setSelectedTruck(null);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, setSelectedTruck]);

  return null;
}

function App() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [histories, setHistories] = useState<Record<number, HistoryPoint[]>>({});
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [searchText, setSearchText] = useState("");


  const loadFleetData = () => {
    fetch("http://127.0.0.1:8000/fleet")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load fleet data");
        }

        return response.json();
      })
      .then(data => {
        setVehicles(data.vehicles);
        setHistories(data.histories);
      })
      .catch(error => {
        console.error("Error loading fleet data:", error);
      });
  };

  useEffect(() => {
    loadFleetData();

    const interval = setInterval(loadFleetData, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalHistoryPoints =
  Object.values(histories).reduce(
    (total, history) => total + history.length,
    0
  );

  const activeTrucks = vehicles.length;

  const averageSpeed =
    vehicles.length > 0
      ? (
          vehicles.reduce((sum, truck) => sum + truck.speed, 0) /
          vehicles.length
        ).toFixed(1)
      : "0";

  const fastestTruck =
    vehicles.length > 0
      ? vehicles.reduce(
          (fastest, truck) =>
            truck.speed > fastest.speed ? truck : fastest
        )
      : null;

  const filteredVehicles = vehicles.filter((vehicle) => {
    return !searchText || vehicle.id.toString() === searchText;
  });

  const selectedVehicle =
    vehicles.find(vehicle => vehicle.id === selectedTruck) || null;
  
  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Active Trucks</h3>
          <p>{activeTrucks}</p>
        </div>

        <div className="stat-card">
          <h3>Average Speed</h3>
          <p>{averageSpeed} mph</p>
        </div>

        <div className="stat-card">
          <h3>Fastest Truck</h3>
          <p>
            {fastestTruck
              ? `Truck ${fastestTruck.id} (${fastestTruck.speed.toFixed(1)} mph)`
              : "N/A"}
          </p>
        </div>

        <div className="stat-card">
          <h3>History Points</h3>
          <p>{totalHistoryPoints}</p>
        </div>
      </div>

      <div className="vehicles-section">
        <h2>Vehicles:</h2>
        
        <input
          type="search"
          placeholder="Search Vehicle"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      
        <button onClick={() => setShowRoutes(!showRoutes)}>
          {showRoutes ? "Hide Routes" : "Show Routes"}
        </button>

        <div className="vehicle-list">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-list-trucks"
              onClick={() => setSelectedTruck(vehicle.id)}
            >
              <strong>Truck {vehicle.id}</strong>
              <div>{vehicle.speed.toFixed(1)} mph</div>
              <span className={vehicle.speed > 0 ? "status-moving" : "status-stopped"}>
                {vehicle.speed > 0 ? "Moving" : "Stopped"}
              </span>
            </div>
          ))}
        </div>

        <MapContainer
          center={[40.798, -77.860]}
          zoom={14}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController selectedTruck={selectedVehicle} />

          <MapClickHandler
            setSelectedTruck={setSelectedTruck}
          />

          {filteredVehicles.map((vehicle) => {

            const pathCoordinates: [number, number][] =
              (histories[vehicle.id] || []).map(point => [
                point.lat,
                point.lon
              ]);

            const color = colors[(vehicle.id - 1) % colors.length];
            const isSelected =
              selectedTruck === null ||
              selectedTruck === vehicle.id;

            return (
              <Fragment key={vehicle.id}>              
                {showRoutes && (
                  <Polyline
                    positions={pathCoordinates}
                    pathOptions={{
                      color,
                      opacity: isSelected ? 1 : 0.15,
                      weight: selectedTruck === vehicle.id ? 6 : 3
                    }}
                  />
                )}

                <CircleMarker
                  center={[vehicle.lat, vehicle.lon]}
                  radius={8}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 1
                  }}
                  eventHandlers={{
                    click: (event) => {
                      event.originalEvent.stopPropagation();

                      setSelectedTruck(
                        selectedTruck === vehicle.id ? null : vehicle.id
                      );
                    }
                  }}
                >
                  <Popup>
                    <strong>Truck {vehicle.id}</strong>
                    <br />
                    Speed: {vehicle.speed.toFixed(1)} mph
                    <br />
                    Latitude: {vehicle.lat.toFixed(5)}
                    <br />
                    Longitude: {vehicle.lon.toFixed(5)}
                    <br />
                    History Points: {(histories[vehicle.id] || []).length}
                    <br />
                    Heading: {vehicle.heading.toFixed(1)}°
                    <br />
                    Status:{" "}
                    <span className={vehicle.speed > 0 ? "status-moving" : "status-stopped"}>
                      {vehicle.speed > 0 ? "Moving" : "Stopped"}
                    </span>
                  </Popup>
                </CircleMarker>
              </Fragment>
            );

          })}

        </MapContainer>
      </div>

      <div className="vehicle-panel">

        <h2>Selected Vehicle</h2>
        <div>
          {selectedVehicle ? (
            <>
              <h3>Truck {selectedVehicle.id}</h3>
              
              <div className="vehicle-cards">
                <div className="vehicle-card">
                  <p className="vehicle-label">Speed</p>
                  <p>{selectedVehicle.speed.toFixed(1)} mph</p>
                </div>

                <div className="vehicle-card">
                  <p className="vehicle-label">Heading</p>
                  <p>{selectedVehicle.heading.toFixed(1)}°</p>
                </div>

                <div className="vehicle-card">
                  <p className="vehicle-label">Latitude</p>
                  <p>{selectedVehicle.lat.toFixed(5)}</p>
                </div>

                <div className="vehicle-card">
                  <p className="vehicle-label">Longitude</p>
                  <p>{selectedVehicle.lon.toFixed(5)}</p>
                </div>

                <div className="vehicle-card">
                  <p className="vehicle-label">History</p>
                  <p>{(histories[selectedVehicle.id] || []).length}</p>
                </div>

                <div className="vehicle-card">
                  <p className="vehicle-label">Status</p>
                  <p className={selectedVehicle.speed > 0 ? "status-moving" : "status-stopped"}>
                    {selectedVehicle.speed > 0 ? "Moving" : "Stopped"}</p>
                </div>
              </div>

              <button onClick={() => setSelectedTruck(null)}>
                Clear Selection
              </button>
            </>
          ) : (
            <div>
              <p>No vehicle selected.</p>
              <p>Click a vehicle on the map to inspect it.</p>
            </div>
          )}
        </div>
      
      </div>

    </div>
  );
}

export default App;