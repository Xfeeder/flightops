import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import MetarWidget from '../components/MetarWidget';
import MapView from '../components/MapView';
import AirportSelect from '../components/AirportSelect';
import FlightLog from '../components/FlightLog';

function Flights() {
  const [formData, setFormData] = useState({
    flightplanID: '',
    flightNumber: '',
    aircraftType: '',
    aircraftRegistration: '',
    origin: '',
    departure: '',
    arrival: '',
    flighttime: '',
    date: '',
    alternateairport: '',
    flightcrew: '',
    standbycrew: '',
    freightvolume: '',
    flightStatus: 'Planned',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'flights'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Flight successfully saved to Firestore!');
    } catch (error) {
      console.error('❌ Error saving flight:', error);
    }
  };

  return (
    <div className="flights-page">
      <h2>FlightOps – New Flight Form</h2>

      <MetarWidget station="CYYJ" />

      <MapView
        from={formData.departure}
        to={formData.arrival}
        alternate={formData.alternateairport}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="flightNumber"
          placeholder="Flight Number"
          value={formData.flightNumber}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="aircraftType"
          placeholder="Aircraft Type"
          value={formData.aircraftType}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="aircraftRegistration"
          placeholder="Aircraft Registration"
          value={formData.aircraftRegistration}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={formData.origin}
          onChange={handleChange}
        /><br />

        <AirportSelect
          name="departure"
          value={formData.departure}
          onChange={handleChange}
          label="Departure Airport"
        /><br />

        <AirportSelect
          name="arrival"
          value={formData.arrival}
          onChange={handleChange}
          label="Arrival Airport"
        /><br />

        <AirportSelect
          name="alternateairport"
          value={formData.alternateairport}
          onChange={handleChange}
          label="Alternate Airport"
        /><br />

        <input
          type="text"
          name="flighttime"
          placeholder="Flight Time"
          value={formData.flighttime}
          onChange={handleChange}
        /><br />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="flightcrew"
          placeholder="Flight Crew"
          value={formData.flightcrew}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="standbycrew"
          placeholder="Standby Crew"
          value={formData.standbycrew}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="freightvolume"
          placeholder="Freight Volume"
          value={formData.freightvolume}
          onChange={handleChange}
        /><br />

        <label>Status:</label><br />
        <select
          name="flightStatus"
          value={formData.flightStatus}
          onChange={handleChange}
        >
          <option value="Planned">Planned</option>
          <option value="In-Air">In-Air</option>
          <option value="Completed">Completed</option>
        </select><br /><br />

        <button type="submit">Submit Flight</button>
      </form>

      <FlightLog />
    </div>
  );
}

export default Flights;