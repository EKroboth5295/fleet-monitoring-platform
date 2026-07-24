import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import './App.css';

type Vehicle = {
  id: number;
  lat: number;
  lon: number;
  speed: number;
};

function App() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/vehicles")
        .then(response => response.json())
        .then(data => {
          setVehicles(data);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

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