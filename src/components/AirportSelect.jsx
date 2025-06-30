import React from 'react';

function AirportSelect({ name, value, onChange, label }) {
  const airports = [
    { code: 'CYYZ', name: 'Toronto Pearson' },
    { code: 'CYVR', name: 'Vancouver Int’l' },
    { code: 'CYYJ', name: 'Victoria Int’l' },
    { code: 'CYUL', name: 'Montréal-Trudeau' },
    { code: 'CYOW', name: 'Ottawa Macdonald–Cartier' },
    { code: 'CYHZ', name: 'Halifax Stanfield' },
    { code: 'CYWG', name: 'Winnipeg James Armstrong Richardson' },
  ];

  return (
    <div>
      <label>{label}</label><br />
      <select name={name} value={value} onChange={onChange} required>
        <option value="">Select an airport</option>
        {airports.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.code} – {airport.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AirportSelect;