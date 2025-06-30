import React, { useState } from 'react';

function NewFlightForm({ onSubmit }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFlight = {
      flightNumber,
      departure,
      arrival,
      date,
    };
    onSubmit(newFlight);
    setFlightNumber('');
    setDeparture('');
    setArrival('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Flight</h3>
      <input
        type="text"
        placeholder="Flight Number"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="Departure Airport"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="Arrival Airport"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
        required
      /><br />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      /><br />
      <button type="submit">Create Flight</button>
    </form>
  );
}

export default NewFlightForm;