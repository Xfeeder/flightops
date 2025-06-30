import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DateTime } from 'luxon';

import redIconUrl from '../assets/icons/marker-icon-red.png';
import purpleIconUrl from '../assets/icons/marker-icon-violet.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Departure marker
const redIcon = L.icon({
  iconUrl: redIconUrl,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Arrival marker
const purpleIcon = L.icon({
  iconUrl: purpleIconUrl,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function useCurvedPathAnimation(from, to, duration = 12000, steps = 300) {
  const [position, setPosition] = useState([from.latitude, from.longitude]);

  useEffect(() => {
    const p0 = [from.latitude, from.longitude];
    const p2 = [to.latitude, to.longitude];

    const controlLat = (p0[0] + p2[0]) / 2 + 10;
    const controlLon = (p0[1] + p2[1]) / 2;

    const points = [];
    for (let t = 0; t <= 1; t += 1 / steps) {
      const x =
        (1 - t) ** 2 * p0[0] +
        2 * (1 - t) * t * controlLat +
        t ** 2 * p2[0];
      const y =
        (1 - t) ** 2 * p0[1] +
        2 * (1 - t) * t * controlLon +
        t ** 2 * p2[1];
      points.push([x, y]);
    }

    let frame = 0;
    let raf;
    function animate() {
      if (frame < points.length) {
        setPosition(points[frame]);
        frame++;
        raf = requestAnimationFrame(animate);
      }
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [from, to]);

  return position;
}

function EnhancedPopup({ title, data }) {
  return (
    <div style={{ fontSize: '14px', lineHeight: '1.4em', maxWidth: '240px' }}>
      <strong>{title}: {data.airport}</strong><br />
      Code: {data.iata || '—'} / {data.icao || '—'}<br />
      Location: {data.city || '—'}, {data.country || '—'}<br />
      Terminal: {data.terminal || '—'} | Gate: {data.gate || '—'}<br />
      Scheduled: {data.scheduled
        ? DateTime.fromISO(data.scheduled).toLocaleString(DateTime.DATETIME_MED)
        : '—'}<br />
      Actual: {data.actual
        ? DateTime.fromISO(data.actual).toLocaleString(DateTime.DATETIME_MED)
        : '—'}
    </div>
  );
}

function AnimatedMap({ from, to, flightId }) {
  const animatedPos = useCurvedPathAnimation(from, to);
  const map = useMap();

  useEffect(() => {
    map.setView(animatedPos);
  }, [animatedPos, map]);

  return (
    <Marker position={animatedPos}>
      <Popup>✈️ {flightId} (En route)</Popup>
    </Marker>
  );
}

function FlightMap({ lat, lon, flightId, from, to }) {
  if (
    !from?.latitude || !from?.longitude ||
    !to?.latitude || !to?.longitude
  ) return null;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', marginTop: '20px' }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AnimatedMap from={from} to={to} flightId={flightId} />

      <Marker position={[from.latitude, from.longitude]} icon={redIcon}>
        <Popup>
          <EnhancedPopup title="🔴 Departure" data={from} />
        </Popup>
      </Marker>

      <Marker position={[to.latitude, to.longitude]} icon={purpleIcon}>
        <Popup>
          <EnhancedPopup title="🟣 Arrival" data={to} />
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default FlightMap;