import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../utils/teamUtils';
import Head from 'next/head';
import AdUnit from '../components/AdUnit';
import Footer from '../components/Footer';
import { fetchFromApi } from '../utils/ssr';

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

export default function HomePage({ data }) {
  const router = useRouter();
  const page = parseInt(router.query.page || '1', 10);
  const itemsPerPage = 10;
  const nextOpponent = 'Miami';

  if (!data.length) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '2rem auto',
          padding: '1rem',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
        }}
      >
        <NavBar />
        <p style={{ marginTop: '2rem' }}>No data available.</p>
        <p>Please check back later for updated belt information.</p>
      </div>
    );
  }

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
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>
        Next Game Preview
      </h2>
      <div style={{ marginBottom: '1rem', color: '#000' }}>
        South Florida begins its first ever belt reign with a showdown against the Miami Hurricanes. The Bulls seek their first
        defense and aim to extend the surprising College Football Belt reign. Miami was expected to potentially have a shot at
        the belt against an in-state team preseason, but it was not expected to be USF.
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>
        Reign Summary
      </h2>
      <div style={{ marginBottom: '1rem', color: '#000' }}>
        {currentReign.beltHolder} captured the College Football Belt on {currentReign.startOfReign} and has defended it{' '}
        {currentReign.numberOfDefenses} time{currentReign.numberOfDefenses === 1 ? '' : 's'}. This marks their{' '}
        {countReigns(currentReign.beltHolder)} reign{countReigns(currentReign.beltHolder) === 1 ? '' : 's'} with an overall belt
        record of {currentRecord.wins}-{currentRecord.losses}-{currentRecord.ties} ({currentRecord.winPct}). The upcoming clash
        with {nextOpponent} offers a chance to extend the streak and further cement their lineal legacy.
      </div>

      <section style={{ marginBottom: '1.5rem', color: '#000', lineHeight: 1.6 }}>
        <p>
          The College Football Belt is a lineal championship that traces a single path through the sport's history, rewarding
          each program that manages to topple the reigning holder on the field. Much like boxing’s legendary belts, ownership is
          determined solely by results: beat the champion and the prize is yours. The tradition begins with first ever football game where Rutgers defeated Princeton 6-4 in 1869. Every subsequent game featuring the belt holder creates a
          potential transfer of power, making the belt a colorful thread that connects eras, conferences, and generations of
          players.
        </p>
     
        <p>
          This site exists to make the belt’s journey easy to follow for casual fans and diehards alike. By combining a
          historical database with up-to-date matchup previews, it highlights the ongoing drama of college football’s most
          unofficial prize. Visitors can explore past reigns, gauge the significance of upcoming games, or trace how their
          favorite team might seize the title. Whether you are discovering the concept for the first time or reminiscing about a
          classic reign, the goal is to offer a central hub for the stories and statistics that define the College Football Belt.
        </p>
      </section>

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
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={`${reign.beltHolder} logo`}
                        style={{ height: 24, marginRight: 8 }}
                      />
                    )}
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

export async function getServerSideProps({ req }) {
  const data = await fetchFromApi(req, '/api/belt');
  return { props: { data, hasContent: data.length > 0 } };
}
