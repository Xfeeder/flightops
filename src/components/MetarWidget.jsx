import React, { useEffect, useState } from 'react';

function MetarWidget({ station = 'CYYJ' }) {
  const [metar, setMetar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetar = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://aviationweather.gov/api/data/metar?ids=${station}&format=raw&hours=1`
        );
        const text = await res.text();
        setMetar(text.trim());
      } catch (err) {
        setMetar('Error fetching METAR');
        console.error(err);
      }
      setLoading(false);
    };

    fetchMetar();
  }, [station]);

  return (
    <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px', margin: '1rem 0' }}>
      <h3>🌦 METAR for {station}</h3>
      {loading ? <p>Loading...</p> : <code>{metar}</code>}
    </div>
  );
}

export default MetarWidget;