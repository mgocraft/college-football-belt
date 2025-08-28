import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  teamLogoMap,
  normalizeTeamName,
  computeRecord,
  debugTeamGames,
} from '../../utils/teamUtils';
import AdUnit from '../../components/AdUnit';
import NavBar from '../../components/NavBar';

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
      .then((json) => {
        setData(json);
        if (typeof window !== 'undefined' && team) {
          debugTeamGames(team, json);
        }
      })
      .catch((err) => console.error('Error loading belt data:', err));
  }, [team]);

  if (!data.length || !team) return <p></p>;

  const normalizedTeam = normalizeTeamName(team);

  // Find if the team actually exists in the dataset
  const validTeams = new Set(data.map((r) => normalizeTeamName(r.beltHolder)));
  const teamExists = validTeams.has(normalizedTeam);

  if (!teamExists) {
    // 🚫 No ads here, just a message
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '2rem auto',
          padding: '1.5rem',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <NavBar />
        <h1 style={{ fontSize: '2rem', color: '#001f3f', marginTop: '1rem' }}>
          Team not found
        </h1>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
          The team <strong>{team}</strong> is not in the College Football Belt history.
        </p>
      </div>
    );
  }

  // ----------------
  // Normal valid team flow
  // ----------------
  const logoId = teamLogoMap[normalizedTeam];
  const logoUrl = logoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
    : '';

  const filteredReigns = data
    .filter((r) => normalizeTeamName(r.beltHolder) === normalizedTeam)
    .sort((a, b) => new Date(b.startOfReign) - new Date(a.startOfReign));

  const reignCount = filteredReigns.length;
  const { wins: totalWins, losses, ties, winPct } = computeRecord(team, data);

  const totalWinsByTeam = {};
  const totalReignsByTeam = {};
  const beltGameLosses = [];

  data.forEach((reign, idx) => {
    const holder = normalizeTeamName(reign.beltHolder);
    totalWinsByTeam[holder] =
      (totalWinsByTeam[holder] || 0) + 1 + (reign.defenses?.length || 0);
    totalReignsByTeam[holder] = (totalReignsByTeam[holder] || 0) + 1;
    // ... your existing loss-tracking logic unchanged ...
  });

  const winRank =
    Object.keys(totalWinsByTeam)
      .sort((a, b) => totalWinsByTeam[b] - totalWinsByTeam[a])
      .indexOf(team) + 1;

  const reignRank =
    Object.keys(totalReignsByTeam)
      .sort((a, b) => totalReignsByTeam[b] - totalReignsByTeam[a])
      .indexOf(team) + 1;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '2rem auto',
        padding: '1.5rem',
        fontFamily: 'Arial, sans-serif',
        color: '#111',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderRadius: '8px',
      }}
    >
      <NavBar />

      {/* ✅ Ads only on valid teams */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdUnit AdSlot="9168138847" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {logoUrl && (
          <img src={logoUrl} alt={`${team} logo`} style={{ height: 100 }} />
        )}
        <h1 style={{ fontSize: '2rem', color: '#001f3f' }}>{team}</h1>
      </div>

      {/* ... rest of your valid-team content unchanged ... */}

      <div style={{ marginBottom: '1.5rem' }}>
        <AdUnit AdSlot="9168138847" />
      </div>
    </div>
  );
}
