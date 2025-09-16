import React from 'react';
import NavBar from '../components/NavBar';
import AdSlot from '../components/AdSlot';
import Head from 'next/head';
import Link from 'next/link';
import { teamLogoMap, normalizeTeamName } from '../utils/teamUtils';
import { fetchFromApi } from '../utils/ssr';

export default function RecordBookPage({ data }) {
  const head = (
    <Head>
      <title>Record Book - College Football Belt</title>
      <meta
        name="description"
        content="Historical highlights and statistical leaders from every College Football Belt game."
      />
      <meta property="og:image" content="/images/fallback-helmet.png" />
    </Head>
  );

  if (!data.length)
    return (
      <>
        <NavBar />
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
          {head}
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Record Book</h1>
          <p style={{ marginBottom: '1rem' }}>
            Historical highlights and statistical leaders from every College Football Belt game.
          </p>
          <p>No data available.</p>
        </div>
      </>
    );

  const teamStats = {};
  const allTeams = new Set();
  const matchupCounts = {};

  const cleanOpponentName = (text) => {
    if (!text) return null;
    let cleaned = text.trim().replace(/^(vs\.|at)\s*/i, '').replace(/^#\d+\s*/i, '');
    const parenIndex = cleaned.indexOf('(');
    if (parenIndex !== -1) cleaned = cleaned.substring(0, parenIndex).trim();
    return cleaned;
  };

  data.forEach((reign) => {
    const holder = reign.beltHolder;
    const defenses = reign.defenses || [];
    allTeams.add(holder);
    defenses.forEach((defText) => {
      const opponent = cleanOpponentName(defText);
      if (opponent) allTeams.add(opponent);

      if (!teamStats[opponent]) teamStats[opponent] = { wins: 0, losses: 0, reigns: 0 };
      teamStats[opponent].losses++;

      const matchupKey = [holder, opponent].sort().join(' vs ');
      matchupCounts[matchupKey] = (matchupCounts[matchupKey] || 0) + 1;
    });

    if (!teamStats[holder]) teamStats[holder] = { wins: 0, losses: 0, reigns: 0 };
    teamStats[holder].reigns++;
    teamStats[holder].wins += defenses.length + 1;
  });

  const longestReign = data.reduce((a, b) => (a.numberOfDefenses > b.numberOfDefenses ? a : b));

  const mostLossesWithoutWin = Object.entries(teamStats)
    .filter(([team, stats]) => stats.wins === 0)
    .sort((a, b) => b[1].losses - a[1].losses)[0];

  const mostReigns = Object.entries(teamStats).sort((a, b) => b[1].reigns - a[1].reigns)[0];
  const mostWins = Object.entries(teamStats).sort((a, b) => b[1].wins - a[1].wins)[0];
  const mostLosses = Object.entries(teamStats).sort((a, b) => b[1].losses - a[1].losses)[0];

  const majorFBS = [
    'Alabama','Auburn','LSU','Florida','Georgia','Texas','Texas A&M','Oklahoma','Tennessee','Ole Miss','Mississippi State','Arkansas','Kentucky','Missouri','South Carolina',
    'Ohio State','Michigan','Penn State','Michigan State','Iowa','Wisconsin','Nebraska','Minnesota','Illinois','Indiana','Purdue','Maryland','Rutgers','Northwestern',
    'USC','UCLA','Washington','Oregon','Cal','Stanford','Arizona','Arizona State','Colorado','Utah',
    'Florida State','Miami','Clemson','North Carolina','NC State','Duke','Virginia','Virginia Tech','Wake Forest','Boston College','Louisville','Syracuse','Pitt','Georgia Tech'
  ];

  const neverWon = majorFBS.filter(team => !teamStats[team] || teamStats[team].reigns === 0);

  const topMatchups = Object.entries(matchupCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const logo = (team) => {
    const id = teamLogoMap[normalizeTeamName(team)];
    return id ? <img src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`} alt={team} style={{ height: 30, marginRight: 8 }} /> : null;
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
  };

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
        {head}

        {/* Safe top ad: only after data is present */}
        <div style={{ margin: '1rem 0' }}>
          <AdSlot AdSlot="9168138847" enabled={data.length > 0} />
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Record Book</h1>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#001f3f' }}>About the Record Book</h2>
      <p style={{ marginBottom: '1rem' }}>
        College Football Belt’s record book distills more than a century of championship lineage into a quick
        reference for the curious fan. The summary at the top ranks programs by record book superlatives: the
        longest reign, teams that have piled up wins, and those that keep falling short. Beneath those highlights,
        the page explores broader trends. The 'Top 5 Most Played Belt Matchups' table showcases rivalries that have
        repeatedly influenced the belt's path, revealing traditional powers and regional battles. Another list calls
        out major FBS programs that have never captured the title, a reminder of how elusive the belt can be. Use
        these tables alongside the <Link href="/team/allteamsrecords">All Teams Records</Link> directory to study how
        individual schools stack up and identify surprising underperformers. For a fuller narrative about how the belt
        originated and why fans track it, visit the <Link href="/about">about page</Link>. Together these resources
        provide a compact yet meaningful history of the sport's most itinerant championship. Whether you're scanning
        for the dominant dynasties or tracing obscure upsets, the record book turns decades of box scores into a
        digestible snapshot.
      </p>

      <div style={rowStyle}><strong>🏆 Longest Reign:</strong>&nbsp; {logo(longestReign.beltHolder)} {longestReign.beltHolder} with {longestReign.numberOfDefenses} defenses</div>
      <div style={rowStyle}><strong>💔 Most Losses Without a Win:</strong>&nbsp; {logo(mostLossesWithoutWin[0])} {mostLossesWithoutWin[0]} with {mostLossesWithoutWin[1].losses} losses</div>
      <div style={rowStyle}><strong>👑 Most Reigns:</strong>&nbsp; {logo(mostReigns[0])} {mostReigns[0]} with {mostReigns[1].reigns} reigns</div>
      <div style={rowStyle}><strong>✅ Most Wins:</strong>&nbsp; {logo(mostWins[0])} {mostWins[0]} with {mostWins[1].wins} wins</div>
      <div style={rowStyle}><strong>❌ Most Losses:</strong>&nbsp; {logo(mostLosses[0])} {mostLosses[0]} with {mostLosses[1].losses} losses</div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#001f3f' }}>Top 5 Most Played Belt Matchups</h2>
        {topMatchups.map(([matchup, count]) => (
          <div key={matchup} style={rowStyle}>
            <strong>{matchup}</strong>: {count} belt games
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#001f3f' }}>Major FBS Teams That Have Never Held the Belt</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {neverWon.map(team => (
            <div key={team} style={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
              {logo(team)} {team}
            </div>
          ))}
        </div>
      </div>

      {/* Safe bottom ad: only after data is present */}
        <div style={{ margin: '1.5rem 0' }}>
          <AdSlot
            AdSlot="9168138847"
            enabled={data.length > 0}
            startIndex={3}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const data = await fetchFromApi(req, '/api/belt');
  return { props: { data } };
}
