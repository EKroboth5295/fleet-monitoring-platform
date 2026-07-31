import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import './App.css';

type Vehicle = {
  id: number;
  lat: number;
  lon: number;
  speed: number;
};

function App() {

  console.log("APP LOADED");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const pathCoordinates = history.map(point => [
  point.lat,
  point.lon
]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/vehicles")
        .then(response => response.json())
        .then(data => {
          setVehicles(data);
        });
      fetch("http://127.0.0.1:8000/history/1")
        .then(response => response.json())
        .then(historyData => {
          console.log("History length:", historyData.length);
          setHistory(historyData);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/vehicles")
        .then(res => res.json())
        .then(data => setVehicles(data));

    fetch("http://127.0.0.1:8000/history/1")
        .then(res => res.json())
        .then(historyData => {
            console.log(historyData);
            setHistory(historyData);
        });

}, []);

  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <h2>History points: {history.length}</h2>

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

        <Polyline positions={pathCoordinates} />

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lon]}
          >
            <Popup>
              Truck {vehicle.id}
              <br />
              Speed: {vehicle.speed} mph
            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  );
}

export default App;