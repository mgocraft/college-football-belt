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
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (typeof window !== 'undefined' && team) {
          debugTeamGames(team, json); // ✅ Log all W/L/T games to console
        }
      })
      .catch((err) => console.error('Error loading belt data:', err));
  }, [team]);

  if (!data.length || !team) return <p>Loading...</p>;

  const normalizedTeam = normalizeTeamName(team);
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

    if (holder === normalizedTeam) return;

    const defenses = reign.defenses || [];
    const nextReign = data[idx + 1];
    const beltWasLost =
      nextReign &&
      normalizeTeamName(nextReign.beltHolder) !== holder;

    defenses.forEach((text, i) => {
      const isFinalDefense = i === defenses.length - 1;
      if (isFinalDefense && beltWasLost) return;

      const match = text.match(
        /^(vs\.|at)\s+(.*?)\s+\((W|L|T)\s+(\d+)[\-–](\d+)\)/
      );
      if (!match) return;

      const [, , opponentRaw, result, score1, score2] = match;
      const opponent = normalizeTeamName(opponentRaw.trim());

      if (opponent !== normalizedTeam) return;

      const teamScore = parseInt(score2);
      const oppScore = parseInt(score1);
      const isLossOrTie = teamScore <= oppScore;
      const isTie = result === 'T';

      if (isLossOrTie) {
        const context = `Challenge to ${reign.beltHolder} Reign ${reign.startOfReign} to ${reign.endOfReign}`;
        const score = `${teamScore}-${oppScore} (${
          isTie ? 'Tie' : 'Failed Attempt to Win Belt'
        })`;
        beltGameLosses.push({ context, score });
      }
    });
  });

  const winRank =
    Object.keys(totalWinsByTeam)
      .sort((a, b) => totalWinsByTeam[b] - totalWinsByTeam[a])
      .indexOf(team) + 1;

  const reignRank =
    Object.keys(totalReignsByTeam)
      .sort((a, b) => totalReignsByTeam[b] - totalReignsByTeam[a])
      .indexOf(team) + 1;

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

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

   <div style={{ marginBottom: '1.5rem' }}>
  <AdUnit adSlot="9168138847" />
</div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${team} logo`}
            style={{ height: 100 }}
          />
        )}
        <h1 style={{ fontSize: '2rem', color: '#001f3f' }}>{team}</h1>
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '2rem',
          lineHeight: '1.8',
        }}
      >
        <div>
          <strong>Total Reigns:</strong> {reignCount}
        </div>
        <div>
          <strong>Total Record:</strong> {totalWins} - {losses} - {ties}
        </div>
        <div>
          <strong>Win Percentage:</strong> {winPct}%
        </div>
        <div>
          <strong>Rank by Wins:</strong> #{winRank}
        </div>
        <div>
          <strong>Rank by Reigns:</strong> #{reignRank}
        </div>
      </div>

      <h2
        style={{
          fontSize: '1.5rem',
          marginBottom: '0.75rem',
          color: '#001f3f',
        }}
      >
        Belt Reigns
      </h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '2rem',
        }}
      >
        <thead>
          <tr>
            <th style={styles.tableHeader}>Start</th>
            <th style={styles.tableHeader}>End</th>
            <th style={styles.tableHeader}>Defenses</th>
          </tr>
        </thead>
        <tbody>
          {filteredReigns.map((reign, idx) => (
            <React.Fragment key={idx}>
              <tr
                onClick={() => toggleRow(idx)}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#f5f7fa' : 'white',
                  cursor: 'pointer',
                }}
              >
                <td style={styles.tableCell}>{reign.startOfReign}</td>
                <td style={styles.tableCell}>{reign.endOfReign}</td>
                <td style={styles.tableCell}>{reign.numberOfDefenses}</td>
              </tr>
              {expandedRows[idx] && (
                <>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td colSpan={3} style={styles.tableCell}>
                      <strong>Belt won:</strong> {reign.beltWon}
                    </td>
                  </tr>
                  {(reign.defenses || []).map((def, i) => (
                    <tr key={i} style={{ backgroundColor: '#fafafa' }}>
                      <td colSpan={3} style={styles.tableCell}>
                        <strong>Defense {i + 1}:</strong> {def}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2
        style={{
          fontSize: '1.5rem',
          marginBottom: '0.75rem',
          color: '#001f3f',
        }}
      >
        Unsuccessful Challenges ({beltGameLosses.length})
      </h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '2rem',
        }}
      >
        <thead>
          <tr>
            <th style={styles.tableHeader}>Game Context</th>
            <th style={styles.tableHeader}>Result</th>
          </tr>
        </thead>
        <tbody>
          {beltGameLosses.map((m, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? '#f5f7fa' : 'white',
              }}
            >
              <td style={styles.tableCell}>{m.context}</td>
              <td style={styles.tableCell}>{m.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <div style={{ marginBottom: '1.5rem' }}>
  <AdUnit adSlot="9168138847" />
</div>
    </div>
    

  );
}
