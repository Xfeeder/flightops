import React, { useState } from 'react';
import NewFlightForm from './components/NewFlightForm';

function FlightDashboard() {
  const [flights, setFlights] = useState([]);

  const handleNewFlight = (flight) => {
    setFlights((prev) => [...prev, flight]);
  };

  return (
    <div>
      <NewFlightForm onSubmit={handleNewFlight} />
      <h3>Scheduled Flights</h3>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            {flight.flightNumber} — {flight.departure} ✈ {flight.arrival} on {flight.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlightDashboard;