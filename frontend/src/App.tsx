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

  console.log("APP LOADED");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [histories, setHistories] = useState<Record<number, any[]>>({});
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);

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

  const selectedVehicle =
    vehicles.find(vehicle => vehicle.id === selectedTruck) || null;

  return (
    <div>
      <h1>Fleet Dashboard</h1>
      <p>Real-time Vehicle Monitoring System</p>

      <h2>Fleet Statistics</h2>

      <p>Active Trucks: {activeTrucks}</p>

      <p>Average Speed: {averageSpeed} mph</p>

      <p>
        Fastest Truck:
        {fastestTruck
          ? ` Truck ${fastestTruck.id} (${fastestTruck.speed} mph)`
          : " N/A"}
      </p>

      <p>History Points: {totalHistoryPoints}</p>

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
        
        <MapController selectedTruck={selectedVehicle} />

        <MapClickHandler
          setSelectedTruck={setSelectedTruck}
        />

        {vehicles.map((vehicle) => {

          const pathCoordinates = (histories[vehicle.id] || []).map(point => [
            point.lat,
            point.lon
          ]);

          const color = colors[(vehicle.id - 1) % colors.length];
          const isSelected =
            selectedTruck === null ||
            selectedTruck === vehicle.id;

          return (
            <Fragment key={vehicle.id}>
              <Polyline
                positions={pathCoordinates}
                pathOptions={{
                  color,
                  opacity: isSelected ? 1 : 0.15
                }}
              />

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
                </Popup>
              </CircleMarker>
            </Fragment>
          );

        })}

      </MapContainer>

    </div>
  );
}

export default App;