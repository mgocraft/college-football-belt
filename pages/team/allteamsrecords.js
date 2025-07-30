import React, { useEffect, useState } from 'react';
import { teamLogoMap, normalizeTeamName } from '../../utils/teamUtils';

export default function AllTeamsRecords() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [openStates, setOpenStates] = useState({});
  const [openReigns, setOpenReigns] = useState({});

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading belt data:', err));
  }, []);

  if (!data.length) return <p>Loading...</p>;

  const teamStats = {};

  const cleanOpponentName = (text) => {
    const match = text.match(/(?:vs\.|at)?\s*#?\d*\s*([A-Za-z.&\s'-]+?)(?=\s+\(|$)/i);
    if (!match) return null;
    return match[1].trim();
  };

  data.forEach((reign) => {
    const winner = reign.beltHolder;
    const loser = reign.beltWon;
    const defenses = reign.defenses || [];

    if (!teamStats[winner]) teamStats[winner] = { wins: 0, losses: 0, reigns: [], games: [] };
    if (!teamStats[loser]) teamStats[loser] = { wins: 0, losses: 0, reigns: [], games: [] };

    const totalWins = 1 + defenses.length;
    teamStats[winner].wins += totalWins;
    teamStats[winner].reigns.push(reign);
    teamStats[winner].games.push({ result: 'W', opponent: loser, date: reign.startOfReign });

    teamStats[loser].losses += 1;
    teamStats[loser].games.push({ result: 'L', opponent: winner, date: reign.startOfReign });

    defenses.forEach((defenseText) => {
      const opponent = cleanOpponentName(defenseText);
      if (opponent) {
        if (!teamStats[opponent]) teamStats[opponent] = { wins: 0, losses: 0, reigns: [], games: [] };
        teamStats[opponent].losses += 1;
        teamStats[winner].games.push({ result: 'W', opponent, date: defenseText });
        teamStats[opponent].games.push({ result: 'L', opponent: winner, date: defenseText });
      }
    });
  });

  const sortedTeams = Object.entries(teamStats)
    .sort(([, a], [, b]) => (b.wins + b.losses) - (a.wins + a.losses));

  const filteredTeams = sortedTeams.filter(([team]) =>
    normalizeTeamName(team).toLowerCase().includes(filter.toLowerCase())
  );

  const toggleOpen = (team) => {
    setOpenStates(prev => ({ ...prev, [team]: !prev[team] }));
  };

  const toggleReignOpen = (team, index) => {
    setOpenReigns(prev => ({
      ...prev,
      [team]: {
        ...(prev[team] || {}),
        [index]: !((prev[team] || {})[index])
      }
    }));
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>All Teams Records</h1>

      <input
        placeholder="Filter by team name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 100px 80px 80px', fontWeight: 'bold', borderBottom: '2px solid #ccc', paddingBottom: '0.5rem' }}>
        <div>#</div>
        <div>Logo</div>
        <div>Name</div>
        <div>Record</div>
        <div>Win %</div>
        <div>Reigns</div>
      </div>

      {filteredTeams.map(([team, stats], idx) => {
        const logoId = teamLogoMap[normalizeTeamName(team)];
        const logoUrl = logoId ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png` : '';
        const totalGames = stats.wins + stats.losses;
        const winPct = totalGames ? ((stats.wins / totalGames) * 100).toFixed(1) : '0.0';
        const isOpen = openStates[team] || false;

        return (
          <div key={idx} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0', cursor: 'pointer' }} onClick={() => toggleOpen(team)}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 100px 80px 80px', alignItems: 'center' }}>
              <div>{idx + 1}</div>
              <div>{logoUrl && <img src={logoUrl} alt={`${team} logo`} style={{ height: '50px', width: '50px', objectFit: 'contain' }} />}</div>
              <div>{team}</div>
              <div>{stats.wins}-{stats.losses}</div>
              <div>{winPct}%</div>
              <div>{stats.reigns.length}</div>
            </div>

            {isOpen && (
              <div style={{ marginLeft: '3rem', marginTop: '0.5rem' }}>
                {stats.reigns.map((r, i) => {
                  const reignOpen = openReigns[team]?.[i] || false;
                  return (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReignOpen(team, i);
                        }}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Reign {i + 1}: {r.startOfReign} – {r.endOfReign} ({r.numberOfDefenses} defenses)
                      </div>
                      {reignOpen && (
                        <div style={{ marginLeft: '1.5rem', fontSize: '0.9rem' }}>
                          <div>Won from: {r.beltWon}</div>
                          {r.defenses?.map((def, j) => (
                            <div key={j}>Defense {j + 1}: {def}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
