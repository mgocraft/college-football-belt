import React from 'react';
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <Head>
        <title>Privacy Policy - College Football Belt</title>
        <meta
          name="description"
          content="Read the privacy policy for the College Football Belt website."
        />
      </Head>
      <NavBar />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Privacy Policy</h1>

      <p style={{ marginBottom: '1rem' }}>
        This site uses cookies and third-party services (such as Google AdSense) to display ads and track usage data. We do not collect personal information directly. You can manage your cookie settings via your browser.
      </p>
    </div>
  );
}

