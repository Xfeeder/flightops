import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import airports from '../data/airportList.js';


// 1. Configure Leaflet’s default icon once
import defaultIconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl      from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl:    defaultIconUrl,
  shadowUrl:  shadowUrl,
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 2. FlightMap component
export default function FlightMap() {
  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      // you can set a default center/zoom or use fitBounds
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {airports.map(({ code, name, lat, lng }) => (
        <Marker key={code} position={[lat, lng]}>
          <Popup>
            {name} ({code})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}