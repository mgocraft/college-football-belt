import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { teamLogoMap, normalizeTeamName, computeRecord } from '../utils/teamUtils';
import AdSlot from '../components/AdSlot';
import NewsletterSignup from '../components/NewsletterSignup';
import { fetchFromApi } from '../utils/ssr';
import homeStyles from '../styles/HomePage.module.css';
import adStyles from '../styles/FullWidthAd.module.css';
import Seo, { SITE_NAME, SITE_URL } from '../components/Seo';

export default function HomePage({ data }) {
  const router = useRouter();
  const page = parseInt(router.query.page || '1', 10);
  const itemsPerPage = 10;
  const nextOpponent = 'TBD';
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
      buttons.push(
        <span key="start-ellipsis" className={homeStyles.paginationEllipsis}>
          …
        </span>
      );
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => router.push(`/?page=${i}`, undefined, { shallow: true })}
          className={`${homeStyles.pageButton} ${
            page === i ? homeStyles.pageButtonActive : ''
          }`}
          aria-current={page === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      buttons.push(
        <span key="end-ellipsis" className={homeStyles.paginationEllipsis}>
          …
        </span>
      );
    }

    return buttons;
  };

  const featuredTeams = [
    {
      name: currentReign.beltHolder,
      logo: currentLogoUrl,
      title: 'Reigning Belt Holder',
      record: currentRecord,
    },
    {
      name: nextOpponent,
      logo: opponentLogoUrl,
      title: 'Next Challenger',
      record: opponentRecord,
    },
  ];

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
                <AdSlot
                  AdSlot="9168138847"
                  enabled={data.length > 0}
                  fullWidthResponsive={false}
                />
              </div>
            </div>
        <div className={homeStyles.preContent}>
          <NewsletterSignup />
        </div>
        <div className={homeStyles.layout}>
          <main className={homeStyles.mainContent}>
            <div className={homeStyles.mainInner}>
              <section className={homeStyles.heroSection}>
                <div className={homeStyles.heroContent}>
                  <p className={homeStyles.heroEyebrow}>Lineal Championship Tracker</p>
                  <h1 className={homeStyles.heroTitle}>College Football Belt Update</h1>
                  <p className={homeStyles.heroSubtitle}>
                    {currentReign.beltHolder} reclaimed college football&apos;s lineal crown with a 49–20 road win at Stanford.
                    Stay plugged into the reigning champion&apos;s story, the next challenge, and the belt&apos;s path through history.
                  </p>
                  <ul className={homeStyles.heroHighlights}>
                    <li>
                      <span className={homeStyles.heroHighlightLabel}>Last Result</span>
                      <span>November 29 • Stanford, California • W 49–20</span>
                    </li>
                    <li>
                      <span className={homeStyles.heroHighlightLabel}>Current Reign</span>
                      <span>
                        Began {currentReign.startOfReign} • {currentReign.numberOfDefenses} defense
                        {currentReign.numberOfDefenses === 1 ? '' : 's'}
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className={homeStyles.matchupSection}>
                <div className={homeStyles.card}>
                  <div className={homeStyles.cardHeader}>Next Defense</div>
                  <div className={homeStyles.matchupGrid}>
                    {featuredTeams.map((team) => (
                      <div key={team.name} className={homeStyles.matchupTeam}>
                        <Link href={`/team/${encodeURIComponent(team.name)}`} legacyBehavior>
                          <a className={homeStyles.teamLink}>
                            {team.logo ? (
                              <img
                                src={team.logo}
                                alt={`${team.name} logo`}
                                className={homeStyles.teamLogo}
                              />
                            ) : (
                              <span className={homeStyles.teamLogoPlaceholder}>
                                {team.name
                                  .split(' ')
                                  .map((word) => word[0])
                                  .join('')}
                              </span>
                            )}
                            <span className={homeStyles.teamName}>{team.name}</span>
                          </a>
                        </Link>
                        <span className={homeStyles.teamRole}>{team.title}</span>
                      </div>
                    ))}
                    <div className={homeStyles.matchupDivider} aria-hidden="true">
                      vs
                    </div>
                  </div>
                  <div className={homeStyles.matchupMeta}>
                    <span>Last game: November 29 at Stanford — {currentReign.beltHolder} won 49–20.</span>
                    <span>Next defense: To be announced for the 2026 schedule.</span>
                  </div>
                </div>
              </section>

              <section className={homeStyles.statsSection}>
                <div className={homeStyles.statsGrid}>
                  {featuredTeams.map((team) => {
                    const reignsCount = countReigns(team.name);
                    return (
                      <div key={team.name} className={homeStyles.statsCard}>
                        <div className={homeStyles.statsCardHeader}>
                          <span className={homeStyles.statsEyebrow}>{team.title}</span>
                          <Link href={`/team/${encodeURIComponent(team.name)}`} legacyBehavior>
                            <a className={homeStyles.statsTeamLink}>{team.name}</a>
                          </Link>
                        </div>
                        <dl className={homeStyles.statsList}>
                          <div>
                            <dt>Reigns</dt>
                            <dd>{reignsCount}</dd>
                          </div>
                          <div>
                            <dt>All-time Belt Record</dt>
                            <dd>
                              {team.record.wins}-{team.record.losses}-{team.record.ties}
                            </dd>
                          </div>
                          <div>
                            <dt>Win Percentage</dt>
                            <dd>{team.record.winPct}</dd>
                          </div>
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={homeStyles.sectionCard}>
                <div className={homeStyles.sectionHeader}>
                  <h2>Next Game Preview</h2>
                  <p>Recapping the latest result and what it means for the belt path.</p>
                </div>
                <p>
                  Notre Dame stormed into Palo Alto and blew past Stanford 49–20 on November 29, ending the Cardinal&apos;s two-game
                  reign and claiming the belt for the seventh time in program history. The Irish delivered their statement win on
                  the road, turning a late-season showdown into a decisive belt transfer.
                </p>
                <p className={homeStyles.sectionFootnote}>
                  With the belt back in Independent hands, the next defense will hinge on Notre Dame&apos;s upcoming slate — stay
                  tuned for the first 2026 challenger.
                </p>
              </section>

              <section className={homeStyles.sectionCard}>
                <div className={homeStyles.sectionHeader}>
                  <h2>Reign Snapshot</h2>
                  <p>Where the belt currently stands.</p>
                </div>
                <p>
                  {currentReign.beltHolder} captured the College Football Belt on {currentReign.startOfReign} and has defended it{' '}
                  {currentReign.numberOfDefenses} time{currentReign.numberOfDefenses === 1 ? '' : 's'}. This marks their{' '}
                  {countReigns(currentReign.beltHolder)} reign{countReigns(currentReign.beltHolder) === 1 ? '' : 's'} with an overall belt
                  record of {currentRecord.wins}-{currentRecord.losses}-{currentRecord.ties} ({currentRecord.winPct}). The next defense will
                  be set once Notre Dame&apos;s 2026 slate is finalized, giving Irish fans time to savor a new belt reign.
                </p>
              </section>

              <section className={`${homeStyles.sectionCard} ${homeStyles.sectionCardAlt}`}>
                <div className={homeStyles.sectionHeader}>
                  <h2>About the College Football Belt</h2>
                  <p>The story behind the sport&apos;s unofficial crown.</p>
                </div>
                <div className={homeStyles.bodyTextGroup}>
                  <p>
                    The College Football Belt is a lineal championship that traces a single path through the sport&apos;s history, rewarding
                    each program that manages to topple the reigning holder on the field. Much like boxing’s legendary belts, ownership is
                    determined solely by results: beat the champion and the prize is yours. The tradition begins with the first ever
                    football game where Rutgers defeated Princeton 6-4 in 1869. Every subsequent game featuring the belt holder creates a
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

              <section className={homeStyles.sectionCard}>
                <div className={homeStyles.sectionHeader}>
                  <h2>Past Belt Reigns</h2>
                  <p>Scroll through the programs that have held the crown.</p>
                </div>
                <div className={homeStyles.tableScroll}>
                  <table className={homeStyles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Team</th>
                        <th scope="col">Start</th>
                        <th scope="col">End</th>
                        <th scope="col">Defenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedReigns.map((reign) => {
                        const logoId = teamLogoMap[normalizeTeamName(reign.beltHolder)];
                        const logoUrl = logoId
                          ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${logoId}.png`
                          : '';
                        return (
                          <tr key={`${reign.beltHolder}-${reign.startOfReign}`}>
                            <td className={`${homeStyles.tableCell} ${homeStyles.teamCell}`}>
                              {logoUrl && (
                                <img
                                  src={logoUrl}
                                  alt={`${reign.beltHolder} logo`}
                                  className={homeStyles.tableTeamLogo}
                                />
                              )}
                              <Link href={`/team/${encodeURIComponent(reign.beltHolder)}`} legacyBehavior>
                                <a>{reign.beltHolder}</a>
                              </Link>
                            </td>
                            <td className={homeStyles.tableCell}>{reign.startOfReign}</td>
                            <td className={homeStyles.tableCell}>{reign.endOfReign}</td>
                            <td className={homeStyles.tableCell}>{reign.numberOfDefenses}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className={homeStyles.pagination}>{getPagination()}</div>
              </section>
            </div>
          </main>
          <div className={homeStyles.layoutAdRow}>
            <div className={`${adStyles.fullWidthAd} ${adStyles.looseBottom}`}>
              <div className={adStyles.inner}>
                <AdSlot
                  AdSlot="9168138847"
                  enabled={data.length > 0}
                  fullWidthResponsive={false}
                />
              </div>
            </div>
          </div>
          <aside className={homeStyles.sidebar}>
            <div className={adStyles.sidebarAd}>
              <AdSlot
                AdSlot="9168138847"
                enabled={data.length > 0}
                style={{ display: 'block', width: '100%', minHeight: 250, maxHeight: 600 }}
                format="rectangle"
                fullWidthResponsive={false}
              />
            </div>
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
