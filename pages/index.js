import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../utils/teamUtils';
import AdSlot from '../components/AdSlot';
import NewsletterSignup from '../components/NewsletterSignup';
import BeltBookBanner from '../components/BeltBookBanner';
import { beltBookSpotlight } from '../data/beltBookSpotlight';
import { fetchFromApi } from '../utils/ssr';
import homeStyles from '../styles/HomePage.module.css';
import adStyles from '../styles/FullWidthAd.module.css';
import Seo, { SITE_NAME, SITE_URL } from '../components/Seo';

// ...inside your component render where the placeholder was:

const tableStyles = {
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
  const nextOpponent = 'Stanford';
  const homepageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Live tracker for the College Football Belt, the lineal championship that passes whenever the reigning holder is defeated.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/team/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    about: {
      '@type': 'Thing',
      name: 'College Football Belt',
      description:
        'College football’s unofficial lineal championship traced from 1869 to the present day.',
    },
  };

  const verificationMetaTag = (
    <Head>
      <meta
        key="impact-site-verification"
        name="impact-site-verification"
        value="f17e97a8-30ec-463f-a644-9a435fadb782"
      />
    </Head>
  );

  if (!data.length) {
    return (
      <>
        <Seo
          title="College Football Belt – The Lineal Title Tracker"
          description="Track the history, reigns, and future path of the College Football Belt – the lineal championship of college football."
          canonicalPath="/"
          image="/images/fallback-helmet.png"
          structuredData={homepageStructuredData}
        />
        {verificationMetaTag}
        <NavBar />
        <div
          style={{
            maxWidth: 700,
            margin: '2rem auto',
            padding: '1rem',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
          }}
        >
          <p style={{ marginTop: '2rem' }}>No data available.</p>
          <p>Please check back later for updated belt information.</p>
        </div>
      </>
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
    <>
      <Seo
        title="College Football Belt – The Lineal Title Tracker"
        description="Track the history, reigns, and future path of the College Football Belt – the lineal championship of college football."
        canonicalPath="/"
        image="/images/fallback-helmet.png"
        structuredData={homepageStructuredData}
      />
      {verificationMetaTag}
      <NavBar />
      <div className={homeStyles.pageContainer}>
        <div className={`${adStyles.fullWidthAd} ${adStyles.tightTop}`}>
          <div className={adStyles.inner}>
            <AdSlot AdSlot="9168138847" enabled={data.length > 0} />
          </div>
        </div>
        <div className={homeStyles.preContent}>
          <NewsletterSignup />
        </div>
        <div className={homeStyles.layout}>
          <main className={homeStyles.mainContent}>
            <div className={homeStyles.mainInner}>
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
                    <th style={tableStyles.tableHeader}>Team</th>
                    <th style={tableStyles.tableHeader}>Reigns</th>
                    <th style={tableStyles.tableHeader}>Record</th>
                    <th style={tableStyles.tableHeader}>Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {[currentReign.beltHolder, nextOpponent].map((team) => {
                    const record = computeRecord(team, data);
                    const reignsCount = countReigns(team);
                    return (
                      <tr key={team}>
                        <td style={tableStyles.tableCell}>
                          <Link href={`/team/${encodeURIComponent(team)}`} legacyBehavior>
                            <a>{team}</a>
                          </Link>
                        </td>
                        <td style={tableStyles.tableCell}>{reignsCount}</td>
                        <td style={tableStyles.tableCell}>{record.wins} - {record.losses} - {record.ties}</td>
                        <td style={tableStyles.tableCell}>{record.winPct}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <section className={homeStyles.section}>
                <h2 className={homeStyles.sectionTitle}>Next Game Preview</h2>
                <p className={homeStyles.bodyText}>
                  California stunned Louisville 28–24 on October 25, prying the College Football Belt away in the Cardinals'
                  first defense. The Golden Bears now bring the lineal title to the Bay for the first time and welcome Stanford
                  to Berkeley on November 1 for their opening defense.
                </p>
              </section>

              <section className={homeStyles.section}>
                <h2 className={homeStyles.sectionTitle}>Reign Summary</h2>
                <p className={homeStyles.bodyText}>
                  {currentReign.beltHolder} captured the College Football Belt on {currentReign.startOfReign} and has defended it{' '}
                  {currentReign.numberOfDefenses} time{currentReign.numberOfDefenses === 1 ? '' : 's'}. This marks their{' '}
                  {countReigns(currentReign.beltHolder)} reign{countReigns(currentReign.beltHolder) === 1 ? '' : 's'} with an overall belt
                  record of {currentRecord.wins}-{currentRecord.losses}-{currentRecord.ties} ({currentRecord.winPct}). The upcoming clash
                  with {nextOpponent} offers a chance to extend the streak and further cement their lineal legacy.
                </p>
              </section>

              <section className={homeStyles.section}>
                <h2 className={homeStyles.sectionTitle}>About The CFB Belt</h2>
                <div className={homeStyles.bodyTextGroup}>
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
                </div>
              </section>

              <h2 className={homeStyles.sectionTitle}>Past Belt Reigns</h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableStyles.tableHeader}>Team</th>
                    <th style={tableStyles.tableHeader}>Start</th>
                    <th style={tableStyles.tableHeader}>End</th>
                    <th style={tableStyles.tableHeader}>Defenses</th>
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
                        <td style={tableStyles.tableCell}>
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
                        <td style={tableStyles.tableCell}>{reign.startOfReign}</td>
                        <td style={tableStyles.tableCell}>{reign.endOfReign}</td>
                        <td style={tableStyles.tableCell}>{reign.numberOfDefenses}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ marginTop: '1rem' }}>{getPagination()}</div>
            </div>
          </main>
          <div className={homeStyles.layoutAdRow}>
            <div className={`${adStyles.fullWidthAd} ${adStyles.looseBottom}`}>
              <div className={adStyles.inner}>
                <AdSlot
                  AdSlot="9168138847"
                  enabled={data.length > 0}
                  startIndex={3}
                />
              </div>
            </div>
          </div>
          <aside className={homeStyles.sidebar}>
            <BeltBookBanner {...beltBookSpotlight} />
          </aside>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const data = await fetchFromApi(req, '/api/belt');
  return { props: { data, hasContent: data.length > 0 } };
}
