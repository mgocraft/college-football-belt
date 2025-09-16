import React, { useState } from 'react';
import Link from 'next/link';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../../utils/teamUtils';
import NavBar from '../../components/NavBar';
import AdSlot from '../../components/AdSlot';
import Head from 'next/head';
import { fetchFromApi } from '../../utils/ssr';

const cleanTeamName = (name = '') =>
  name.replace(/^#\d+\s*/, '').split('(')[0].trim();

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NO_VALUE = '—';

const formatDateLabel = (value) => {
  if (!value) return NO_VALUE;

  const parts = value.split('/');
  if (parts.length !== 3) return value;

  const [monthStr, dayStr, yearStr] = parts;
  const monthIndex = Number.parseInt(monthStr, 10) - 1;
  const day = Number.parseInt(dayStr, 10);
  const year = Number.parseInt(yearStr, 10);

  if (
    monthIndex < 0 || monthIndex >= MONTH_LABELS.length ||
    [day, year].some((num) => Number.isNaN(num))
  ) {
    return value;
  }

  return `${MONTH_LABELS[monthIndex]} ${day}, ${year}`;
};

export default function AllTeamsRecords({ data }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('wins');
  const [sortAsc, setSortAsc] = useState(false);

  const head = (
    <Head>
      <title>All Teams Records - College Football Belt</title>
      <meta
        name="description"
        content="Search and sort every program's performance in College Football Belt history."
      />
      <meta property="og:image" content="/images/fallback-helmet.png" />
    </Head>
  );

  if (!data.length) {
    return (
      <>
        <NavBar />
        <div
          style={{
            maxWidth: '700px',
            margin: '2rem auto',
            padding: '1rem',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
          }}
        >
          {head}
          <p style={{ marginTop: '2rem' }}>No data available.</p>
          <p>Try again later.</p>
        </div>
      </>
    );
  }

  const teamSet = new Set();
  data.forEach((reign) => {
    teamSet.add(cleanTeamName(reign.beltHolder));
    (reign.defenses || []).forEach((defText) => {
      const match = defText.match(/^(vs\.?|at) (?:#\d+ )?(.*?) \((W|L|T) (\d+)[\-\u2013](\d+)\)/);
      if (match) {
        const opponentRaw = match[2];
        teamSet.add(cleanTeamName(opponentRaw));
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

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortAsc ? 1 : -1;
      if (bVal == null) return sortAsc ? -1 : 1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  const FALLBACK_LOGO = '/images/fallback-helmet.png';

  const handleSort = (key) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        {head}

        <div style={{ marginBottom: '1.5rem' }}>
          <AdSlot AdSlot="9168138847" variant="leaderboard" enabled={data.length > 0} />
        </div>

      <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>All Teams Records</h1>
      <h2 style={{ textAlign: 'center', fontSize: '1.25rem', margin: '0.5rem 0', color: '#001f3f' }}>About These Team Records</h2>
      <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Every school that has participated in a College Football Belt game is cataloged below, offering a searchable
        database of wins, losses, ties, and reigns. The table lets you filter by name, reorder by clicking any column,
        and follow links to individual team pages for deeper dives. Comparing win percentages side by side reveals which
        programs seized their opportunities and which let the belt slip away. Historians can trace eras of dominance or
        drought, while newcomers gain a quick sense of the belt’s competitive landscape. Use it alongside the <Link href="/record-book">Record Book</Link> to identify standout
        performances or surprising absences, and visit the <Link href="/about">about page</Link> for background on how the
        belt travels from champion to champion. By centralizing every program’s belt resume, this table highlights the
        breadth of schools touched by the title and invites fans to explore the stories behind the numbers. It is an
        evolving ledger that grows with each new game.
      </p>

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
        <div onClick={() => handleSort('lastReignTimestamp')}>Last Reign</div>
        <div className="num" onClick={() => handleSort('longestReign')}>Longest Reign</div>
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
                <div className="dateCell">{formatDateLabel(row.lastReignStart)}</div>
                <div className="num">{row.reigns > 0 ? row.longestReign : NO_VALUE}</div>
              </div>
            </a>
          </Link>
      );
      })}

        <div style={{ margin: '1.5rem 0' }}>
          <AdSlot
            AdSlot="9168138847"
            variant="leaderboard"
            enabled={data.length > 0}
            startIndex={3}
          />
        </div>

        <style jsx>{`
        .rowLink { text-decoration: none; color: inherit; }
        .gridRow {
          display: grid;
          grid-template-columns: 40px 60px minmax(0, 1fr) 60px 60px 60px 60px 80px 140px 120px;
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
        .dateCell { white-space: nowrap; }

        @media (max-width: 640px) {
          .gridRow {
            grid-template-columns: 24px 40px minmax(0, 1fr) 48px 48px 44px 56px 56px 120px 80px;
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
          .gridRow > :nth-child(8),
          .gridRow > :nth-child(9),
          .gridRow > :nth-child(10) {
            display: none;
          }
        }
      `}</style>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const data = await fetchFromApi(req, '/api/belt');
  return { props: { data, hasContent: data.length > 0 } };
}
