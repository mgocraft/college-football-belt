import React from 'react';
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <Head>
        <title>Terms & Conditions - College Football Belt</title>
        <meta
          name="description"
          content="Read the terms and conditions for using the College Football Belt website."
        />
      </Head>
      <NavBar />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Terms & Conditions</h1>

      <p style={{ marginBottom: '1rem' }}>
        By using this site, you agree to use it for informational purposes only and accept that all content is provided as-is without warranties.
      </p>

      <p style={{ marginBottom: '1rem' }}>
        <strong>FTC Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. This means that if you click on a link to a product on Amazon and make a purchase, I may receive a small commission at no additional cost to you.
      </p>
    </div>
  );
}

