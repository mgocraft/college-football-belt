import React, { useEffect, useState } from 'react';
import {
  teamLogoMap,
  normalizeTeamName,
  computeRecord,
  debugTeamGames,
  cleanOpponentName,
  getResult,
} from '../../utils/teamUtils';
import AdSlot from '../../components/AdSlot';
import adStyles from '../../styles/FullWidthAd.module.css';
import NavBar from '../../components/NavBar';
import Seo, { SITE_URL } from '../../components/Seo';
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

const parseDateToTimestamp = (value) => {
  if (!value) return null;

  const parts = value.split('/');
  if (parts.length !== 3) return null;

  const [monthStr, dayStr, yearStr] = parts;
  const month = Number.parseInt(monthStr, 10) - 1;
  const day = Number.parseInt(dayStr, 10);
  const year = Number.parseInt(yearStr, 10);

  if ([month, day, year].some((num) => Number.isNaN(num))) return null;

  const timestamp = new Date(year, month, day).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export default function TeamPage({ data, team }) {
  const [expandedRows, setExpandedRows] = useState({});
  const canonicalPath = team ? `/team/${encodeURIComponent(team)}` : '/team';

  useEffect(() => {
    if (typeof window !== 'undefined' && team) {
      debugTeamGames(team, data);
    }
  }, [team, data]);

  if (!data.length || !team) {
    return (
      <>
        <Seo
          title={team ? `${team} - College Football Belt History` : 'College Football Belt Team'}
          description={
            team
              ? `Explore ${team}'s history with the College Football Belt.`
              : 'Team information for the College Football Belt.'
          }
          canonicalPath={canonicalPath}
          noIndex
        />
        <NavBar />
        <div
          style={{
            maxWidth: 700,
            margin: '2rem auto',
            padding: '1.5rem',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
          }}
        >
          <p style={{ marginTop: '2rem' }}>No data available.</p>
          <p>Please check back later.</p>
        </div>
      </>
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
      <>
        <Seo
          title={team ? `${team} - College Football Belt History` : 'College Football Belt Team'}
          description={
            team
              ? `Explore ${team}'s history with the College Football Belt.`
              : 'Team information for the College Football Belt.'
          }
          canonicalPath={canonicalPath}
          noIndex
        />
        <NavBar />
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
          <h1 style={{ fontSize: '2rem', color: '#001f3f', marginTop: '1rem' }}>
            Team not found
          </h1>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            The team <strong>{team}</strong> is not in the College Football Belt history.
          </p>
        </div>
      </>
    );
  }

  // ---------- Valid team flow ----------
  const logoId = teamLogoMap[normalizedTeam];
  const logoUrl = logoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
    : '';

  const teamStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team,
    sport: 'College Football',
    url: `${SITE_URL}${canonicalPath}`,
    description: `College Football Belt history for ${team}.`,
    logo: logoUrl || `${SITE_URL}/images/fallback-helmet.png`,
  };

  const filteredReigns = data
    .filter((r) => normalizeTeamName(r.beltHolder) === normalizedTeam)
    .sort((a, b) => new Date(b.startOfReign) - new Date(a.startOfReign));

  const reignCount = filteredReigns.length;
  const { wins: totalWins, losses, ties, winPct } = computeRecord(team, data);

  const teamStats = {};
  const beltGameLosses = [];

  data.forEach((reign, idx) => {
    const holder = normalizeTeamName(reign.beltHolder);
    const defenses = reign.defenses || [];
    const defenseCount = Number.isFinite(reign.numberOfDefenses)
      ? reign.numberOfDefenses
      : defenses.length;

    if (!teamStats[holder]) {
      teamStats[holder] = {
        displayName: reign.beltHolder,
        wins: 0,
        reigns: 0,
        longestReign: 0,
        mostRecentTimestamp: null,
      };
    }

    teamStats[holder].wins += 1 + defenseCount;
    teamStats[holder].reigns += 1;
    if (defenseCount > teamStats[holder].longestReign) {
      teamStats[holder].longestReign = defenseCount;
    }

    const reignStartTimestamp = parseDateToTimestamp(reign.startOfReign);
    if (
      reignStartTimestamp != null &&
      (teamStats[holder].mostRecentTimestamp == null ||
        reignStartTimestamp > teamStats[holder].mostRecentTimestamp)
    ) {
      teamStats[holder].mostRecentTimestamp = reignStartTimestamp;
    }

    if (holder === normalizedTeam) return;

    const nextReign = data[idx + 1];
    const beltWasLost =
      nextReign && normalizeTeamName(nextReign.beltHolder) !== holder;

    defenses.forEach((text, i) => {
      const match = text.match(/^(vs\.|at)\s+(.*?)\s+\((W|L|T)\s+(\d+)[\-–](\d+)\)/);
      if (!match) return;

      const [, , opponentRaw, holderResult, score1, score2] = match;
      const opponent = cleanOpponentName(opponentRaw);

      if (opponent !== normalizedTeam) return;

      const isFinalDefense = i === defenses.length - 1;
      const holderLostToTeam = holderResult === 'L';
      if (isFinalDefense && beltWasLost && holderLostToTeam) {
        return;
      }

      const challengerResult = getResult(text, true);
      if (challengerResult !== 'L' && challengerResult !== 'T') return;

      const teamScore = parseInt(score2, 10);
      const oppScore = parseInt(score1, 10);
      const isTie = challengerResult === 'T';

      const context = `Challenge to ${reign.beltHolder} Reign ${reign.startOfReign} to ${reign.endOfReign}`;
      const score = `${teamScore}-${oppScore} (${isTie ? 'Tie' : 'Failed Attempt to Win Belt'})`;
      beltGameLosses.push({ context, score });
    });
  });

  const rankTeam = (accessor, { descending = true } = {}) => {
    const entries = Object.entries(teamStats);
    if (!entries.length) return null;

    const sorted = entries.sort(([, aStats], [, bStats]) => {
      const rawA = accessor(aStats);
      const rawB = accessor(bStats);
      const valueA = rawA == null ? Number.NEGATIVE_INFINITY : rawA;
      const valueB = rawB == null ? Number.NEGATIVE_INFINITY : rawB;

      if (valueA === valueB) {
        const nameA = aStats.displayName || '';
        const nameB = bStats.displayName || '';
        return nameA.localeCompare(nameB);
      }

      return descending ? valueB - valueA : valueA - valueB;
    });

    const index = sorted.findIndex(([key]) => key === normalizedTeam);
    return index === -1 ? null : index + 1;
  };

  const winRank = rankTeam((stats) => stats.wins);
  const reignRank = rankTeam((stats) => stats.reigns);
  const longestReignRank = rankTeam((stats) => stats.longestReign);
  const mostRecentReignRank = rankTeam((stats) => stats.mostRecentTimestamp);

  const formatRank = (rank) =>
    typeof rank === 'number' && rank > 0 ? `#${rank}` : '—';

  const firstReign = reignCount > 0 ? filteredReigns[reignCount - 1] : null;
  const intro = `This page chronicles ${team}'s history with the College Football Belt, which passes to any FBS team that defeats the current holder.`;
  const summary = firstReign
    ? `${team} first captured the College Football Belt on ${firstReign.startOfReign} after ${firstReign.beltWon}. The program has enjoyed ${reignCount} total reign${reignCount === 1 ? '' : 's'} and owns a belt game record of ${totalWins}-${losses}-${ties}.`
    : `${team} has never held the College Football Belt. The team is ${totalWins}-${losses}-${ties} in belt games.`;

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      <Seo
        title={`${team} - College Football Belt History`}
        description={`Explore ${team}'s history with the College Football Belt.`}
        canonicalPath={canonicalPath}
        image={logoUrl || '/images/fallback-helmet.png'}
        structuredData={teamStructuredData}
      />
      <NavBar />
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
        {/* ✅ Gate manual ads on real data */}
        <div className={adStyles.fullWidthAd}>
          <div className={adStyles.inner}>
            <AdSlot
              AdSlot="9168138847"
              enabled={data.length > 0}
            />
          </div>
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
        <div><strong>Rank by Wins:</strong> {formatRank(winRank)}</div>
        <div><strong>Rank by Reigns:</strong> {formatRank(reignRank)}</div>
        <div><strong>Rank by Longest Reign:</strong> {formatRank(longestReignRank)}</div>
        <div><strong>Rank by Most Recent Reign:</strong> {formatRank(mostRecentReignRank)}</div>
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

        <div className={`${adStyles.fullWidthAd} ${adStyles.spaced}`}>
          <div className={adStyles.inner}>
            <AdSlot AdSlot="9168138847" enabled={data.length > 0} />
          </div>
        </div>
      </div>
    </>
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
