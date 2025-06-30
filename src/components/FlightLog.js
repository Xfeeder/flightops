import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

function FlightLog() {
  const [flights, setFlights] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    departure: '',
    arrival: '',
    status: '',
    date: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'flights'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFlights(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...flights];

    if (filters.departure) {
      result = result.filter((f) => f.departure === filters.departure);
    }
    if (filters.arrival) {
      result = result.filter((f) => f.arrival === filters.arrival);
    }
    if (filters.status) {
      result = result.filter((f) => f.flightStatus === filters.status);
    }
    if (filters.date) {
      result = result.filter((f) => f.date === filters.date);
    }
    setFiltered(result);
  }, [filters, flights]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const ref = doc(db, 'flights', id);
      await updateDoc(ref, { flightStatus: newStatus });
    } catch (error) {
      console.error('❌ Error updating status:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const downloadCSV = () => {
    const headers = [
      'Flight Number',
      'Departure',
      'Arrival',
      'Alternate',
      'Aircraft',
      'Date',
      'Status',
    ];
    const rows = filtered.map((f) => [
      f.flightNumber,
      f.departure,
      f.arrival,
      f.alternateairport,
      f.aircraftType,
      f.date,
      f.flightStatus,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((val) => `"${(val || '').toString().replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Planned':
        return { backgroundColor: '#ccc', color: '#333', fontWeight: 'bold' };
      case 'In-Air':
        return { backgroundColor: 'gold', color: '#000', fontWeight: 'bold' };
      case 'Completed':
        return { backgroundColor: 'mediumseagreen', color: '#fff', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>📋 Flight Log</h3>

      {/* 🔍 Filters */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          name="departure"
          placeholder="Filter by Departure"
          value={filters.departure}
          onChange={handleFilterChange}
          style={filterInput}
        />
        <input
          type="text"
          name="arrival"
          placeholder="Filter by Arrival"
          value={filters.arrival}
          onChange={handleFilterChange}
          style={filterInput}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={filterInput}
        >
          <option value="">All Statuses</option>
          <option value="Planned">Planned</option>
          <option value="In-Air">In-Air</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          style={filterInput}
        />
        <button onClick={downloadCSV} style={csvButton}>
          📥 Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No flights match your criteria.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={th}>Flight #</th>
              <th style={th}>From</th>
              <th style={th}>To</th>
              <th style={th}>Alternate</th>
              <th style={th}>Aircraft</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((flight) => (
              <tr key={flight.id}>
                <td style={td}>{flight.flightNumber}</td>
                <td style={td}>{flight.departure}</td>
                <td style={td}>{flight.arrival}</td>
                <td style={td}>{flight.alternateairport}</td>
                <td style={td}>{flight.aircraftType}</td>
                <td style={td}>{flight.date}</td>
                <td style={{ ...td, ...getStatusStyle(flight.flightStatus) }}>
                  <select
                    value={flight.flightStatus}
                    onChange={(e) =>
                      handleStatusChange(flight.id, e.target.value)
                    }
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'inherit',
                      fontWeight: 'bold',
                      fontSize: 'inherit',
                      width: '100%',
                      outline: 'none',
                    }}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In-Air">In-Air</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
};

const td = {
  padding: '8px',
  border: '1px solid #ccc',
};

const filterInput = {
  marginRight: '10px',
  padding: '6px',
};

const csvButton = {
  padding: '6px 12px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default FlightLog;