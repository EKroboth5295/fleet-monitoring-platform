import { useEffect, useState } from "react";
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
    fetch("http://127.0.0.1:8000/vehicles")
      .then(response => response.json())
      .then(data => {
        setVehicles(data);
      });
  }, []);

  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <h2>Vehicles:</h2>

      {vehicles.map((vehicle) => (
        <p key={vehicle.id}>
          Vehicle {vehicle.id}
        </p>
      ))}

    </div>
  );
}

export default App;