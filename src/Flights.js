// src/pages/Flights.js

import React, { useState } from 'react';
import NewFlightForm from '../components/NewFlightForm';

export default function Flights() {
  // holds all scheduled flights
  const [flights, setFlights] = useState([]);

  // adds a new flight to the list
  const handleNewFlight = flight => {
    setFlights(prev => [...prev, flight]);
  };

  return (
    <div className="flights-page">
      <h2>Schedule a New Flight</h2>

      {/* Flight entry form */}
      <NewFlightForm onSubmit={handleNewFlight} />

      <section className="scheduled-flights">
        <h3>Scheduled Flights</h3>

        {flights.length > 0 ? (
          <ul className="flight-list">
            {flights.map((f, idx) => (
              <li key={idx} className="flight-item">
                <span className="flight-number">{f.flightNumber}</span>
                <span className="flight-route">
                  {f.departure} ✈ {f.arrival}
                </span>
                <span className="flight-date">{f.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-flights">No flights scheduled yet.</p>
        )}
      </section>
    </div>
  );
}