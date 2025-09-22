import React from 'react';
import NavBar from '../components/NavBar';
import Seo, { SITE_URL } from '../components/Seo';

export default function PathToConference() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Path to the Conferences',
    url: `${SITE_URL}/path-to-conference`,
    description:
      'Projected scenarios showing how the College Football Belt could travel between conferences during the 2025 season.',
  };

  return (
    <>
      <Seo
        title="Path to the Conferences"
        description="See how the College Football Belt could move into each conference during the 2025 season."
        canonicalPath="/path-to-conference"
        structuredData={structuredData}
      />
      <NavBar />
      <div style={{ maxWidth: '900px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Path to the Conferences</h1>

      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        This page tracks the most likely way the belt could end up in each major conference during the 2025 season, based on Miami's current possession of the belt and the remaining schedule. Bowl games and playoffs are not included. Impact-Site-Verification: f17e97a8-30ec-463f-a644-9a435fadb782
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>ACC</h2>
      <ol>
        <li><strong>Completed:</strong> South Florida lost to Miami (Week 3).</li>
        <li><strong>Completed:</strong> Miami defended the belt by beating Florida 26–7 (Week 4).</li>
        <li><strong>Next:</strong> Miami travels to Florida State on October 4 for a 7 p.m. ET kickoff.</li>
      </ol>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>SEC</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        Florida's quick turnaround bid fizzled in Miami. For the belt to return to the SEC, the Seminoles would need to capture it and then fall to Florida or another SEC opponent later in the fall.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>Big 12</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        There is no direct or likely non-bowl path to the Big 12 this season due to lack of scheduled matchups with Big 12 teams.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>Big Ten</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        Similarly, no clear route exists for the belt to reach the Big Ten before the postseason.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>Group of Five / Independents</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        The belt now resides in the ACC.
      </p>

        <div style={{ marginTop: '2rem', fontStyle: 'italic', color: '#444' }}>
          Belt movement is based on real schedules and historical team strength. This page will update as the season progresses.
        </div>
      </div>
    </>
  );
}
