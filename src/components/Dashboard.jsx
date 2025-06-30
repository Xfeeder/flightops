import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'flights'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlights(data);
    });
    return () => unsubscribe();
  }, []);

  // 📊 Count by status
  const statusCounts = flights.reduce((acc, flight) => {
    const status = flight.flightStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // 📆 Last 7 days: group by date
  const today = new Date();
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyCounts = last7Days.map(date => {
    return flights.filter(f => f.date === date).length;
  });

  // 🛫 Top airports
  const airportCounter = (key) => {
    const counts = {};
    for (const flight of flights) {
      const val = flight[key];
      if (val) counts[val] = (counts[val] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topDepartures = airportCounter('departure');
  const topArrivals = airportCounter('arrival');

  return (
    <div style={{ padding: '24px' }}>
      <h2>📡 Flight Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Planned" value={statusCounts['Planned'] || 0} color="#ccc" />
        <StatCard label="In-Air" value={statusCounts['In-Air'] || 0} color="gold" />
        <StatCard label="Completed" value={statusCounts['Completed'] || 0} color="mediumseagreen" />
      </div>

      <h4>📈 Flights in the Past 7 Days</h4>
      <div style={{ maxWidth: '600px' }}>
        <Bar
          data={{
            labels: last7Days,
            datasets: [
              {
                label: 'Flights',
                data: dailyCounts,
                backgroundColor: '#3f51b5',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '60px' }}>
        <div>
          <h4>🛫 Top Departure Airports</h4>
          <ul>
            {topDepartures.map(([code, count]) => (
              <li key={code}>{code}: {count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>🛬 Top Arrival Airports</h4>
          <ul>
            {topArrivals.map(([code, count]) => (
              <li key={code}>{code}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      flex: 1,
      background: color,
      color: '#000',
      padding: '16px',
      borderRadius: '6px',
      fontWeight: 'bold',
      textAlign: 'center',
    }}>
      <div>{label}</div>
      <div style={{ fontSize: '24px' }}>{value}</div>
    </div>
  );
}

export default Dashboard;