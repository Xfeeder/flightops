import React, { useState, useEffect } from 'react';
import FlightMap from './FlightMap';

// Calculates distance in km and converts to nautical miles (NM)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = deg => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const distanceKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceNM = distanceKm / 1.852;

  return { km: distanceKm, nm: distanceNM };
}

function computeETA(distKm, speedKmh) {
  if (!speedKmh || speedKmh === 0) return null;
  const hours = distKm / speedKmh;
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlightData = async () => {
    if (!flightNumber) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://api.aviationstack.com/v1/flights?access_key=YOUR_API_KEY&flight_iata=${flightNumber}`
      );
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setFlightData(data.data[0]);
        setError(null);
      } else {
        setError('No flight data found.');
        setFlightData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching data.');
      setFlightData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (flightNumber) fetchFlightData();
    }, 30000);
    return () => clearInterval(interval);
  }, [flightNumber]);

  const geo = flightData?.geography;
  const from = flightData?.departure;
  const to = flightData?.arrival;
  const speedKmh = Number(flightData?.speed?.horizontal) || 0;
  const speedKnots = speedKmh / 1.852;

  let totalDistance = null;
  let remainingDistance = null;
  let eta = null;
  let progress = null;

  if (geo && from && to) {
    totalDistance = calculateDistance(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );

    remainingDistance = calculateDistance(
      geo.latitude,
      geo.longitude,
      to.latitude,
      to.longitude
    );

    eta = computeETA(remainingDistance.km, speedKmh);
    progress = Math.round(
      (1 - remainingDistance.km / totalDistance.km) * 100
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h3>Track a Flight</h3>

      <input
        type="text"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        placeholder="e.g. AC101"
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '220px',
          marginRight: '10px'
        }}
      />

      <button
        onClick={fetchFlightData}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Track
      </button>

      {isLoading && <p style={{ marginTop: '20px' }}>Loading flight info...</p>}
      {error && <p style={{ marginTop: '20px', color: 'red' }}>{error}</p>}

      {flightData && (
        <>
          <div
            style={{
              marginTop: '30px',
              background: '#f8f8f8',
              padding: '20px',
              borderRadius: '8px'
            }}
          >
            <h4>Flight Info</h4>
            <p><strong>Airline:</strong> {flightData.airline?.name}</p>
            <p><strong>From:</strong> {from?.airport}</p>
            <p><strong>To:</strong> {to?.airport}</p>
            <p><strong>Status:</strong> {flightData.flight_status}</p>
          </div>

          {geo?.latitude && geo?.longitude && (
            <>
              <div style={{ marginTop: '20px' }}>
                <FlightMap
                  lat={geo.latitude}
                  lon={geo.longitude}
                  flightId={flightData.flight?.iata}
                  from={from}
                  to={to}
                />
              </div>

              {totalDistance && (
                <div
                  style={{
                    marginTop: '25px',
                    fontSize: '16px',
                    background: '#eef3f9',
                    padding: '15px',
                    borderRadius: '8px'
                  }}
                >
                  <p><strong>Distance:</strong> {totalDistance.km.toFixed(0)} km / {totalDistance.nm.toFixed(0)} NM</p>
                  <p><strong>Remaining:</strong> {remainingDistance.km.toFixed(0)} km / {remainingDistance.nm.toFixed(0)} NM</p>
                  <p><strong>Speed:</strong> {speedKmh.toFixed(0)} km/h / {speedKnots.toFixed(0)} knots</p>
                  <p><strong>ETA:</strong> {eta || '—'}</p>
                  <p><strong>Progress:</strong> {progress || 0}%</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default FlightTracker;