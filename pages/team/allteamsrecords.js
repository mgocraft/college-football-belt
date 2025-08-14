import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../../utils/teamUtils';
import NavBar from '../../components/NavBar';
import AdUnit from '../../components/AdUnit';

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

  if (!data.length) return <p></p>;

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
      const record = computeRecord(team, data); // keep (team, data) if that's your signature
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
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <NavBar />

      <div style={{ marginBottom: '1.5rem' }}>
        <AdUnit adSlot="9168138847" variant="leaderboard" />
      </div>

      <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>All Teams Records</h1>

      <input
        placeholder="Filter by team name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}
      />

      <div className="gridRow header clickable">
        <div>#</div>
        <div>Logo</div>
        <div onClick={() => handleSort('team')}>Name</div>
        <div className="num" onClick={() => handleSort('wins')}>W</div>
        <div className="num" onClick={() => handleSort('losses')}>L</div>
        <div className="num" onClick={() => handleSort('ties')}>T</div>
        <div className="num" onClick={() => handleSort('winPct')}>Win%</div>
        <div className="num" onClick={() => handleSort('reigns')}>Reigns</div>
      </div>

      {sortedTeams.map((row, idx) => {
        const logoId = teamLogoMap[normalizeTeamName(row.team)];
        const logoUrl = logoId
          ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
          : FALLBACK_LOGO;

        return (
          <Link href={`/team/${normalizeTeamName(row.team)}`} key={row.team} legacyBehavior>
            <a className="rowLink">
              <div className="gridRow">
                <div className="num">{idx + 1}</div>
                <div><img src={logoUrl} alt={`${row.team} logo`} className="logo" /></div>
                <div className="teamCell">{row.team}</div>
                <div className="num">{row.wins}</div>
                <div className="num">{row.losses}</div>
                <div className="num">{row.ties}</div>
                <div className="num">{row.winPct.toFixed(1)}%</div>
                <div className="num">{row.reigns}</div>
              </div>
            </a>
          </Link>
        );
      })}

      <div style={{ margin: '1.5rem 0' }}>
        <AdUnit adSlot="9168138847" variant="leaderboard" />
      </div>

      <style jsx>{`
        .rowLink { text-decoration: none; color: inherit; }
        .gridRow {
          display: grid;
          grid-template-columns: 40px 60px 1fr 60px 60px 60px 60px 80px;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #ddd;
          column-gap: 12px;
        }
        .header { font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 0.5rem; }
        .clickable { cursor: pointer; }
        .logo { height: 50px; width: 50px; object-fit: contain; }
        .teamCell {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .num { text-align: right; white-space: nowrap; }

        @media (max-width: 640px) {
          .gridRow {
            grid-template-columns: 24px 40px minmax(0, 1fr) 48px 48px 44px 56px 56px;
            column-gap: 8px;
            padding: 0.35rem 0;
          }
          .logo { height: 36px; width: 36px; }
          .teamCell {
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        @media (max-width: 400px) {
          .gridRow { grid-template-columns: 24px 36px minmax(0, 1fr) 44px 44px 40px 56px; }
          .gridRow > :nth-child(8) { display: none; }
        }
      `}</style>
    </div>
  );
}
