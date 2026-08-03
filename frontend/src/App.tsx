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
  const [histories, setHistories] = useState<Record<number, any[]>>({});

  const pathCoordinates = (histories[1] || []).map(point => [
  point.lat,
  point.lon
]);

  useEffect(() => {
  const interval = setInterval(() => {
  console.log(histories);
  
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

  }, 3000);

  return () => clearInterval(interval);

}, []);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/vehicles")
      .then(res => res.json())
      .then(data => setVehicles(data));

  }, []);

  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <h2>History points: {(histories[1] || []).length}</h2>

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

          return (
            <>
              <Polyline
                key={`line-${vehicle.id}`}
                positions={pathCoordinates}
              />

              <Marker
                key={`marker-${vehicle.id}`}
                position={[vehicle.lat, vehicle.lon]}
              >
                <Popup>
                  Truck {vehicle.id}
                  <br />
                  Speed: {vehicle.speed} mph
                </Popup>
              </Marker>
            </>
          );

        })}

      </MapContainer>

    </div>
  );
}

export default App;