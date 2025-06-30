import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { bcAirports } from '../data/airportList';

function MapView({ from, to, alternate }) {
  const getCoords = (code) => {
    const airport = bcAirports.find((a) => a.code === code);
    return airport ? [airport.lat, airport.lon] : null;
  };

  const fromCoords = getCoords(from);
  const toCoords = getCoords(to);
  const altCoords = getCoords(alternate);

  const route = [fromCoords, toCoords].filter(Boolean);
  const altRoute = [fromCoords, altCoords].filter(Boolean);

  const center = fromCoords || [49.2827, -123.1207]; // Default to Vancouver

  return (
    <div style={{ height: '400px', marginBottom: '1rem' }}>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {fromCoords && (
          <Marker position={fromCoords}>
            <Popup>Departure: {from}</Popup>
          </Marker>
        )}
        {toCoords && (
          <Marker position={toCoords}>
            <Popup>Arrival: {to}</Popup>
          </Marker>
        )}
        {altCoords && (
          <Marker position={altCoords}>
            <Popup>Alternate: {alternate}</Popup>
          </Marker>
        )}

        {route.length === 2 && <Polyline positions={route} color="blue" />}
        {altRoute.length === 2 && <Polyline positions={altRoute} color="orange" />}
      </MapContainer>
    </div>
  );
}

export default MapView;