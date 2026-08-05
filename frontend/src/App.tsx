import { Fragment, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
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
    "pink",
    "teal"
];

type Vehicle = {
  id: number;
  lat: number;
  lon: number;
  speed: number;
};

function App() {

  console.log("APP LOADED");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [histories, setHistories] = useState<Record<number, any[]>>({});

  const loadFleetData = () => {
    fetch("http://127.0.0.1:8000/vehicles")
      .then(response => response.json())
      .then(data => {

        setVehicles(data);

        data.forEach((vehicle: Vehicle) => {

          fetch(`http://127.0.0.1:8000/history/${vehicle.id}`)
            .then(response => response.json())
            .then(historyData => {

              setHistories(prev => ({
                ...prev,
                [vehicle.id]: historyData
              }));

            });

        });

      });
  };

  useEffect(() => {
    loadFleetData();

    const interval = setInterval(loadFleetData, 3000);

    return () => clearInterval(interval);
  }, []);

  // Temporary for debugging
  const totalHistoryPoints =
  Object.values(histories).reduce(
    (total, history) => total + history.length,
    0
  );
  
  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <h2>History points: {totalHistoryPoints}</h2>

      <h2>Vehicles:</h2>

      <MapContainer
        center={[40.798, -77.860]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((vehicle) => {

          const pathCoordinates = (histories[vehicle.id] || []).map(point => [
            point.lat,
            point.lon
          ]);

          const color = colors[(vehicle.id - 1) % colors.length];

          return (
            <Fragment key={vehicle.id}>
              <Polyline
                positions={pathCoordinates}
                pathOptions={{ color }}
              />

              <Marker
                position={[vehicle.lat, vehicle.lon]}
              >
                <Popup>
                  Truck {vehicle.id}
                  <br />
                  Speed: {vehicle.speed} mph
                </Popup>
              </Marker>
            </Fragment>
          );

        })}

      </MapContainer>

    </div>
  );
}

export default App;