import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../utils/teamUtils';
import Head from 'next/head'; 
import AdUnit from '../components/AdUnit';
import Footer from '../components/Footer';

// ...inside your component render where the placeholder was:

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

export default function HomePage() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const page = parseInt(router.query.page || '1', 10);
  const itemsPerPage = 10;
  const nextOpponent = 'Long Island University';

  useEffect(() => {
    fetch('/api/belt')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading belt data:', err));
  }, []);

  if (!data.length) return <p></p>;

  const currentReign = data.find((r) => r.endOfReign === 'Ongoing');

  const currentRecord = computeRecord(currentReign?.beltHolder, data);
  const opponentRecord = computeRecord(nextOpponent, data);

  const countReigns = (team) => data.filter((r) => r.beltHolder === team).length;

  const currentLogoId = teamLogoMap[normalizeTeamName(currentReign?.beltHolder)];
  const opponentLogoId = teamLogoMap[normalizeTeamName(nextOpponent)];
  const currentLogoUrl = currentLogoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${currentLogoId}.png`
    : '';
  const opponentLogoUrl = opponentLogoId
    ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${opponentLogoId}.png`
    : '';

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
          aria-current={page === i ? 'page' : undefined}
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
       <Head>
      <title>College Football Belt – The Lineal Title Tracker</title>
      <meta
        name="description"
        content="Track the history, reigns, and future path of the College Football Belt – the lineal championship of college football."
      />
      <meta property="og:title" content="College Football Belt – CFB Lineal Championship" />
      <meta property="og:description" content="See which team holds the College Football Belt, explore historical reigns, and follow its potential path." />
      <meta property="og:image" content="/images/fallback-helmet.png" />
      <meta property="og:url" content="https://your-domain.com" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
    <NavBar />

    <div style={{ marginBottom: '1.5rem' }}>
  <AdUnit AdSlot="9168138847" enabled={data.length > 0} />
</div>

      <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#001f3f' }}>The College Football Belt</h1>
        <div style={{ fontSize: '1.5rem', fontStyle: 'italic', color: '#666', marginTop: '0.5rem' }}>Next Game</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '2rem', justifyContent: 'center' }}>
        {[{ name: currentReign.beltHolder, logo: currentLogoUrl }, { name: nextOpponent, logo: opponentLogoUrl }].map((team, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <Link href={`/team/${encodeURIComponent(team.name)}`} legacyBehavior>
              <a>
                {team.logo && (
                  <img src={team.logo} alt={`${team.name} logo`} style={{ height: 100, cursor: 'pointer' }} />
                )}
              </a>
            </Link>
            <div style={{ marginTop: 4, fontWeight: 600 }}>{team.name}</div>
          </div>
        ))}
      </div>

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
            const record = computeRecord(team, data);
            const reignsCount = countReigns(team);
            return (
              <tr key={team}>
                <td style={styles.tableCell}>
                  <Link href={`/team/${encodeURIComponent(team)}`} legacyBehavior>
                    <a>{team}</a>
                  </Link>
                </td>
                <td style={styles.tableCell}>{reignsCount}</td>
                <td style={styles.tableCell}>{record.wins} - {record.losses} - {record.ties}</td>
                <td style={styles.tableCell}>{record.winPct}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
<div style={{ marginBottom: '1rem',  color: '#000' }}>
  Florida starts its 2025 season belt defense taking on the Long Island Sharks, an opponent requested by long departed coach Jim McElwain. The Sharks have unsurprisingly never played in a belt game before. With an expected win Florida will move up to a 14th place tie in total wins with Auburn.
</div>
  

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>
        Past Belt Reigns
      </h2>

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

    <div style={{ marginBottom: '1.5rem' }}>
  <AdUnit AdSlot="9168138847" enabled={data.length > 0} />
   <Footer />
</div>
    </div>
  );
}
