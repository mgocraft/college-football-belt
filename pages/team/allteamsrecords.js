import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../../utils/teamUtils';
import NavBar from '../../components/NavBar';

export default function AllTeamsRecords() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('wins');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading belt data:', err));
  }, []);

  if (!data.length) return <p>Loading...</p>;

  const teamSet = new Set();
  data.forEach((reign) => {
    teamSet.add(reign.beltHolder);
    (reign.defenses || []).forEach((defText) => {
      const match = defText.match(/^(vs\.|at) (.*?) \((W|L|T) (\d+)[\-\u2013](\d+)\)/);
      if (match) {
        const opponentRaw = match[2];
        teamSet.add(opponentRaw.trim());
      }
    });
  });

  const sortedTeams = Array.from(teamSet)
    .map((team) => {
      const record = computeRecord(team, data);
      return { team, ...record };
    })
    .filter(({ team }) =>
      normalizeTeamName(team).toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  const FALLBACK_LOGO = '/images/fallback-helmet.png';

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <NavBar />

      <div style={{ width: '100%', height: '90px', background: '#f0f0f0', textAlign: 'center', lineHeight: '90px', marginBottom: '1rem' }}>
        AdSense Placeholder
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>All Teams Records</h1>

      <input
        placeholder="Filter by team name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 60px 1fr 60px 60px 60px 60px 80px',
        fontWeight: 'bold',
        borderBottom: '2px solid #ccc',
        paddingBottom: '0.5rem',
        cursor: 'pointer'
      }}>
        <div>#</div>
        <div>Logo</div>
        <div onClick={() => handleSort('team')}>Name</div>
        <div onClick={() => handleSort('wins')}>W</div>
        <div onClick={() => handleSort('losses')}>L</div>
        <div onClick={() => handleSort('ties')}>T</div>
        <div onClick={() => handleSort('winPct')}>Win%</div>
        <div onClick={() => handleSort('reigns')}>Reigns</div>
      </div>

      {sortedTeams.map((row, idx) => {
        const logoId = teamLogoMap[normalizeTeamName(row.team)];
        const logoUrl = logoId
          ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
          : FALLBACK_LOGO;

        return (
          <Link href={`/team/${normalizeTeamName(row.team)}`} key={row.team} legacyBehavior>
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 60px 1fr 60px 60px 60px 60px 80px',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd'
              }}>
                <div>{idx + 1}</div>
                <div><img src={logoUrl} alt={`${row.team} logo`} style={{ height: '50px', width: '50px', objectFit: 'contain' }} /></div>
                <div>{row.team}</div>
                <div>{row.wins}</div>
                <div>{row.losses}</div>
                <div>{row.ties}</div>
                <div>{row.winPct.toFixed(1)}%</div>
                <div>{row.reigns}</div>
              </div>
            </a>
          </Link>
        );
      })}

      <div style={{ width: '100%', height: '250px', background: '#f0f0f0', textAlign: 'center', lineHeight: '250px', marginTop: '2rem' }}>
        AdSense Placeholder
      </div>
    </div>
  );
}
