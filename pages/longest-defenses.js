import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LongestDefenses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/belt')
      .then(res => res.json())
      .then(setData);
  }, []);

  // Sort desc by number of defenses
  const sortedData = [...data].sort((a, b) => b.numberOfDefenses - a.numberOfDefenses);

  return (
    <main style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <nav style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link href="/">Home</Link>
          {/* Add more links here */}
        </div>
        <div>
          {/* Placeholder for ads */}
          <div style={{
            width: 120, height: 60, backgroundColor: '#eee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#666'
          }}>
            Adsense Here
          </div>
        </div>
      </nav>

      <h1>Longest Title Defenses</h1>
      {sortedData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        sortedData.map((reign) => (
          <div key={reign.reign} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>{`Reign #${reign.reign}: ${reign.beltHolder}`}</h2>
            <p><strong>Number of Defenses:</strong> {reign.numberOfDefenses}</p>
            <p><strong>Start:</strong> {reign.startOfReign} | <strong>End:</strong> {reign.endOfReign}</p>
          </div>
        ))
      )}
    </main>
  );
}
