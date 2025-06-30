import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Card from './components/Card';
import NewFlightForm from './components/NewFlightForm';

function Flights() {
  const [flights, setFlights] = useState([]);

  const fetchFlights = () => {
    fetch('http://localhost:4000/flights')
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(() => setFlights([]));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <>
      <NewFlightForm onFlightAdded={fetchFlights} />
      <Card title="Scheduled Flights">
        {flights.length === 0 ? (
          <p>No flights scheduled.</p>
        ) : (
          flights.map((flight) => (
            <div key={flight.id} style={{ marginBottom: '1rem' }}>
              ✈️ <strong>{flight.flightNumber}</strong><br />
              From: {flight.departure}<br />
              To: {flight.arrival}<br />
              Terminal: {flight.terminal}<br />
              Time: {flight.time}
              <hr />
            </div>
          ))
        )}
      </Card>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/flights" element={<Flights />} />
          <Route path="*" element={<Navigate to="/flights" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
