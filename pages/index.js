import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { teamLogoMap, normalizeTeamName } from '../utils/teamUtils';

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
  tableRowHover: {
    backgroundColor: '#f9fcff',
  },
};

export default function HomePage() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const page = parseInt(router.query.page || '1');
  const itemsPerPage = 10;
  const nextOpponent = 'Texas';

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading belt data:', err));
  }, []);

  if (!data.length) return <p>Loading...</p>;

  const currentReign = data.find((r) => r.endOfReign === 'Ongoing');
  const normalizedHolder = normalizeTeamName(currentReign?.beltHolder);
  const normalizedOpponent = normalizeTeamName(nextOpponent);
  const currentLogoId = teamLogoMap[normalizedHolder];
  const opponentLogoId = teamLogoMap[normalizedOpponent];
  const currentLogoUrl = currentLogoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${currentLogoId}.png`
    : '';
  const opponentLogoUrl = opponentLogoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${opponentLogoId}.png`
    : '';

  const reignsByTeam = {};
  const winsByTeam = {};
  const lossesByTeam = {};
  const gamesByTeam = {};

  data.forEach((reign) => {
    const holder = reign.beltHolder;
    const lostTo = reign.beltWon;

    reignsByTeam[holder] = (reignsByTeam[holder] || 0) + 1;

    winsByTeam[holder] = (winsByTeam[holder] || 0) + 1 + (reign.defenses?.length || 0);

    lossesByTeam[lostTo] = (lossesByTeam[lostTo] || 0) + 1;

    gamesByTeam[holder] = (gamesByTeam[holder] || 0) + 1 + (reign.defenses?.length || 0);
    gamesByTeam[lostTo] = (gamesByTeam[lostTo] || 0) + 1;
  });

  const getWins = (team) => winsByTeam[team] || 0;
  const getLosses = (team) => lossesByTeam[team] || 0;

  const getWinPct = (team) => {
    const wins = getWins(team);
    const losses = getLosses(team);
    const games = wins + losses;
    if (games === 0) return '0%';
    return `${((wins / games) * 100).toFixed(1)}%`;
  };

  const pastReigns = data.filter((r) => r !== currentReign);
  const totalPages = Math.ceil(pastReigns.length / itemsPerPage);
  const paginatedReigns = pastReigns.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getPagination = () => {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    const buttons = [];
    if (start > 1) {
      buttons.push(<span key="start-ellipsis" style={{ margin: '0 8px' }}>...</span>);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => router.push(`/?page=${i}`, undefined, { shallow: true })}
          style={{
            background: page === i ? '#0070f3' : '#eee',
            color: page === i ? '#fff' : '#000',
            padding: '6px 12px',
            borderRadius: 4,
            border: 'none',
            margin: '0 4px',
            cursor: 'pointer',
          }}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      buttons.push(<span key="end-ellipsis" style={{ margin: '0 8px' }}>...</span>);
    }

    return buttons;
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      {/* Navigation links */}
      <nav style={{ marginBottom: '1rem', fontSize: '1rem', color: '#0070f3' }}>
        <Link href="/about">About</Link> | <Link href="/record-book">Record Book</Link> | <Link href="/path-to-conference">Path to Conference</Link>
      </nav>

      {/* Adsense leaderboard placeholder */}
      <div
        style={{
          width: '100%',
          height: '90px',
          backgroundColor: '#f0f0f0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        Ad Placeholder (Leaderboard)
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>🏆 Belt Next Game</h1>

      {/* Logos linked, but text under logos NOT linked */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '2rem',
          justifyContent: 'center',
        }}
      >
        {[{ name: currentReign.beltHolder, logo: currentLogoUrl }, { name: nextOpponent, logo: opponentLogoUrl }].map((team, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <Link href={`/team/${encodeURIComponent(team.name)}`} legacyBehavior>
              <a>
                <img src={team.logo} alt={`${team.name} logo`} style={{ height: 100, cursor: 'pointer' }} />
              </a>
            </Link>
            <div style={{ marginTop: 4, fontWeight: 600 }}>{team.name}</div>
          </div>
        ))}
      </div>

      {/* Main record table - team names linked */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Team</th>
            <th style={styles.tableHeader}>Reigns</th>
            <th style={styles.tableHeader}>Record</th>
            <th style={styles.tableHeader}>Win %</th>
          </tr>
        </thead>
        <tbody>
          {[currentReign.beltHolder, nextOpponent].map((team) => {
            const wins = getWins(team);
            const losses = getLosses(team);
            return (
              <tr key={team}>
                <td style={styles.tableCell}>
                  <Link href={`/team/${encodeURIComponent(team)}`} legacyBehavior>
                    <a>{team}</a>
                  </Link>
                </td>
                <td style={styles.tableCell}>{reignsByTeam[team] || 0}</td>
                <td style={styles.tableCell}>
                  {wins} - {losses}
                </td>
                <td style={styles.tableCell}>{getWinPct(team)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Preview text */}
      <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#444' }}>
        This game will determine whether the belt stays with {currentReign.beltHolder} or passes to {nextOpponent}. It’s expected to be a key matchup this season.
      </div>

      {/* Betting affiliate link */}
      <div style={{ marginBottom: '2rem' }}>
        <a
          href="https://example-betting-affiliate.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: '#0070f3' }}
        >
          🏈 Bet on the Belt Game
        </a>
      </div>

      {/* Past reigns section */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>Past Belt Reigns</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Team</th>
            <th style={styles.tableHeader}>Start</th>
            <th style={styles.tableHeader}>End</th>
            <th style={styles.tableHeader}>Defenses</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReigns.map((reign, idx) => {
            const logoId = teamLogoMap[normalizeTeamName(reign.beltHolder)];
            const logoUrl = logoId
              ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
              : '';
            return (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f5f7fa' : 'white' }}>
                <td style={styles.tableCell}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {logoUrl && <img src={logoUrl} alt="" style={{ height: 24, marginRight: 8 }} />}
                    <Link href={`/team/${encodeURIComponent(reign.beltHolder)}`} legacyBehavior>
                      <a>{reign.beltHolder}</a>
                    </Link>
                  </div>
                </td>
                <td style={styles.tableCell}>{reign.startOfReign}</td>
                <td style={styles.tableCell}>{reign.endOfReign}</td>
                <td style={styles.tableCell}>{reign.numberOfDefenses}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>{getPagination()}</div>

      {/* Adsense medium rectangle placeholder */}
      <div
        style={{
          width: '100%',
          height: '250px',
          backgroundColor: '#f0f0f0',
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        Ad Placeholder (Medium Rectangle)
      </div>
    </div>
  );
}
