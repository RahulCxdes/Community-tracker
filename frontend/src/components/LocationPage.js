import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function LocationPage() {
  const location = useLocation(); // Get the state passed from the previous page
  const { lat, lng } = location.state || {}; // Destructure latitude and longitude from state

  if (!lat || !lng) {
    return <p>No location information provided.</p>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1>Location Map</h1>
      <MapContainer
        center={[lat, lng]} // Center the map on the provided coordinates
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker
          position={[lat, lng]}
          icon={new L.Icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', // Red marker
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            Issue Location: {lat}, {lng}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LocationPage;
