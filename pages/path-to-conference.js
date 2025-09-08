import React from 'react';
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function PathToConference() {
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <Head>
        <title>Path to the Conferences - College Football Belt</title>
        <meta
          name="description"
          content="See how the College Football Belt could move into each conference during the 2025 season."
        />
      </Head>
      <NavBar />
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Path to the Conferences</h1>

      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        This page tracks the most likely way the belt could end up in each major conference during the 2025 season, based on Florida's current possession of the belt and their schedule. Bowl games and playoffs are not included.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>ACC</h2>
      <ol>
        <li>South Florida loses to <strong>Miami</strong> (Week 3)</li>
    
      </ol>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', color: '#001f3f' }}>SEC</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        USF loses to Miami, who loses to Florida to give it back them for a second time this season.
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
        The belt is currently in the AAC.
      </p>

      <div style={{ marginTop: '2rem', fontStyle: 'italic', color: '#444' }}>
        Belt movement is based on real schedules and historical team strength. This page will update as the season progresses.
      </div>
    </div>
  );
}
