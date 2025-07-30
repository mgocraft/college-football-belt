import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { teamLogoMap, normalizeTeamName } from '../../utils/teamUtils';
import Link from 'next/link';

const styles = {
  tableHeader: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '2px solid #ccc',
    backgroundColor: '#f0f4f8',
    color: '#001f3f',
  },
  tableCell: {
    padding: '10px 12px',
    borderBottom: '1px solid #ddd',
  },
};

export default function TeamPage() {
  const router = useRouter();
  const { team } = router.query;
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading belt data:', err));
  }, []);

  if (!data.length || !team) return <p>Loading...</p>;

  const filteredReigns = data.filter((r) => r.beltHolder === team);
  const normalizedTeam = normalizeTeamName(team);
  const logoId = teamLogoMap[normalizedTeam];
  const logoUrl = logoId ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png` : '';

  const reignCount = filteredReigns.length;
  const totalWins = filteredReigns.reduce((acc, r) => acc + 1 + (r.defenses?.length || 0), 0);

  const totalGamesByTeam = {};
  const totalWinsByTeam = {};

  data.forEach((r) => {
    const winner = r.beltHolder;
    const loser = r.beltWon;

    totalWinsByTeam[winner] = (totalWinsByTeam[winner] || 0) + 1 + (r.defenses?.length || 0);
    totalGamesByTeam[winner] = (totalGamesByTeam[winner] || 0) + 1 + (r.defenses?.length || 0);
    totalGamesByTeam[loser] = (totalGamesByTeam[loser] || 0) + 1;
  });

  const totalGames = totalGamesByTeam[team] || 0;
  const losses = Math.max(0, totalGames - totalWins);
  const winPct = totalGames ? `${((totalWins / totalGames) * 100).toFixed(1)}%` : '0%';

  const allTeams = Object.keys(totalWinsByTeam);
  const sortedByWins = allTeams.sort((a, b) => (totalWinsByTeam[b] || 0) - (totalWinsByTeam[a] || 0));
  const winRank = sortedByWins.indexOf(team) + 1;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1.5rem', fontFamily: 'Arial, sans-serif', color: '#111', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
      <nav style={{ marginBottom: '1rem', fontSize: '1rem', color: '#0070f3' }}>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/record-book">Record Book</Link>
      </nav>

      <div style={{ width: '100%', height: '90px', backgroundColor: '#f0f0f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontStyle: 'italic' }}>
        Ad Placeholder (Leaderboard)
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {logoUrl && <img src={logoUrl} alt={`${team} logo`} style={{ height: 100 }} />}
        <h1 style={{ fontSize: '2rem', color: '#001f3f' }}>{team}</h1>
      </div>

      <div style={{textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
        <div><strong>Total Reigns:</strong> {reignCount}</div>
        <div><strong>Total Record:</strong> {totalWins} - {losses}</div>
        <div><strong>Win Percentage:</strong> {winPct}</div>
        <div><strong>Rank by Wins:</strong> #{winRank}</div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>Belt Reigns</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Start</th>
            <th style={styles.tableHeader}>End</th>
            <th style={styles.tableHeader}>Defenses</th>
          </tr>
        </thead>
        <tbody>
          {filteredReigns.map((reign, idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f5f7fa' : 'white' }}>
              <td style={styles.tableCell}>{reign.startOfReign}</td>
              <td style={styles.tableCell}>{reign.endOfReign}</td>
              <td style={styles.tableCell}>{reign.numberOfDefenses}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ width: '100%', height: '250px', backgroundColor: '#f0f0f0', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontStyle: 'italic' }}>
        Ad Placeholder (Medium Rectangle)
      </div>
    </div>
  );
}
