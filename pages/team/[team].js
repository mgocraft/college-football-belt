import React, { useEffect, useState } from 'react';
import {
  teamLogoMap,
  normalizeTeamName,
  computeRecord,
  debugTeamGames,
} from '../../utils/teamUtils';
import AdSlot from '../../components/AdSlot';
import NavBar from '../../components/NavBar';
import Head from 'next/head';
import { fetchFromApi } from '../../utils/ssr';

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

export default function TeamPage({ data, team }) {
  const [expandedRows, setExpandedRows] = useState({});
  const defaultHead = (
    <Head>
      <title>{team ? `${team} - College Football Belt History` : 'College Football Belt Team'}</title>
      <meta
        name="description"
        content={
          team
            ? `Explore ${team}'s history with the College Football Belt.`
            : 'Team information for the College Football Belt.'
        }
      />
      <meta property="og:image" content="/images/fallback-helmet.png" />
    </Head>
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && team) {
      debugTeamGames(team, data);
    }
  }, [team, data]);

  if (!data.length || !team) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '2rem auto',
          padding: '1.5rem',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
        }}
      >
        {defaultHead}
        <NavBar />
        <p style={{ marginTop: '2rem' }}>No data available.</p>
        <p>Please check back later.</p>
      </div>
    );
  }

  const normalizedTeam = normalizeTeamName(team);

  // Verify team exists in data (by beltHolder or as opponent in defenses)
  const validHolders = new Set(data.map((r) => normalizeTeamName(r.beltHolder)));
  let teamExists = validHolders.has(normalizedTeam);
  if (!teamExists) {
    // Scan defenses to see if the team ever appeared as an opponent
    outer: for (const reign of data) {
      for (const text of (reign.defenses || [])) {
        const m = text.match(/^(vs\.|at)\s+(.*?)\s+\((W|L|T)\s+(\d+)[\-–](\d+)\)/);
        if (m) {
          const opp = normalizeTeamName(m[2].trim());
          if (opp === normalizedTeam) { teamExists = true; break outer; }
        }
      }
    }
  }

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
        {defaultHead}
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

  // ---------- Valid team flow ----------
  const logoId = teamLogoMap[normalizedTeam];
  const logoUrl = logoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
    : '';

  const head = (
    <Head>
      <title>{team} - College Football Belt History</title>
      <meta
        name="description"
        content={`Explore ${team}'s history with the College Football Belt.`}
      />
      <meta property="og:image" content={logoUrl || '/images/fallback-helmet.png'} />
    </Head>
  );

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
      nextReign && normalizeTeamName(nextReign.beltHolder) !== holder;

    defenses.forEach((text, i) => {
      const isFinalDefense = i === defenses.length - 1;
      if (isFinalDefense && beltWasLost) return;

      const match = text.match(/^(vs\.|at)\s+(.*?)\s+\((W|L|T)\s+(\d+)[\-–](\d+)\)/);
      if (!match) return;

      const [, , opponentRaw, result, score1, score2] = match;
      const opponent = normalizeTeamName(opponentRaw.trim());

      if (opponent !== normalizedTeam) return;

      const teamScore = parseInt(score2, 10);
      const oppScore = parseInt(score1, 10);
      const isLossOrTie = teamScore <= oppScore;
      const isTie = result === 'T';

      if (isLossOrTie) {
        const context = `Challenge to ${reign.beltHolder} Reign ${reign.startOfReign} to ${reign.endOfReign}`;
        const score = `${teamScore}-${oppScore} (${isTie ? 'Tie' : 'Failed Attempt to Win Belt'})`;
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

  const firstReign = reignCount > 0 ? filteredReigns[reignCount - 1] : null;
  const intro = `This page chronicles ${team}'s history with the College Football Belt, which passes to any FBS team that defeats the current holder.`;
  const summary = firstReign
    ? `${team} first captured the College Football Belt on ${firstReign.startOfReign} after ${firstReign.beltWon}. The program has enjoyed ${reignCount} total reign${reignCount === 1 ? '' : 's'} and owns a belt game record of ${totalWins}-${losses}-${ties}.`
    : `${team} has never held the College Football Belt. The team is ${totalWins}-${losses}-${ties} in belt games.`;

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
      {head}
      <NavBar />

      {/* ✅ Gate manual ads on real data */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot AdSlot="9168138847" enabled={data.length > 0} />
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

      <p
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          marginBottom: '1rem',
          lineHeight: '1.6',
        }}
      >
        {intro}
      </p>

      <p
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}
      >
        {summary}
      </p>

      <div
        style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          marginBottom: '2rem',
          lineHeight: '1.8',
        }}
      >
        <div><strong>Total Reigns:</strong> {reignCount}</div>
        <div><strong>Total Record:</strong> {totalWins} - {losses} - {ties}</div>
        <div><strong>Win Percentage:</strong> {winPct}%</div>
        <div><strong>Rank by Wins:</strong> #{winRank}</div>
        <div><strong>Rank by Reigns:</strong> #{reignRank}</div>
      </div>

      <h2
        style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}
      >
        Belt Reigns
      </h2>

      {/* Responsive wrapper for mobile */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '2rem' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}
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
      </div>

      <h2
        style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}
      >
        Unsuccessful Challenges ({beltGameLosses.length})
      </h2>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '2rem' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}
        >
          <thead>
            <tr>
              <th style={styles.tableHeader}>Game Context</th>
              <th style={styles.tableHeader}>Result</th>
            </tr>
          </thead>
          <tbody>
            {beltGameLosses.map((m, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f5f7fa' : 'white' }}>
                <td style={styles.tableCell}>{m.context}</td>
                <td style={styles.tableCell}>{m.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
      <AdSlot AdSlot="9168138847" enabled={data.length > 0} />
      </div>
    </div>
  );
}

export async function getServerSideProps({ params, req }) {
  const data = await fetchFromApi(req, '/api/belt');
  const normalizedTeam = normalizeTeamName(params.team);

  const validHolders = new Set(
    data.map((r) => normalizeTeamName(r.beltHolder))
  );
  let teamExists = validHolders.has(normalizedTeam);
  if (!teamExists) {
    outer: for (const reign of data) {
      for (const text of reign.defenses || []) {
        const m = text.match(
          /^(vs\.|at)\s+(.*?)\s+\((W|L|T)\s+(\d+)[\-–](\d+)\)/
        );
        if (m) {
          const opp = normalizeTeamName(m[2].trim());
          if (opp === normalizedTeam) {
            teamExists = true;
            break outer;
          }
        }
      }
    }
  }

  return {
    props: {
      data,
      team: params.team,
      hasContent: data.length > 0 && teamExists,
    },
  };
}
