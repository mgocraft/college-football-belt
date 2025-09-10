import React from 'react';
import NavBar from '../components/NavBar';
import Head from 'next/head';
import AdSlot from '../components/AdSlot';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <Head>
        <title>About - College Football Belt</title>
        <meta
          name="description"
          content="Learn about the College Football Belt project, its history, and how to support the site."
        />
      </Head>
      <NavBar />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>About the College Football Belt</h1>

      <p style={{ marginBottom: '1rem' }}>
        This site tracks the College Football Belt — an unofficial title passed from team to team whenever the current holder loses. Inspired by the original website and the passionate fans who kept it alive on Reddit and Twitter, I wanted to bring back a fully featured, modern version.
      </p>

      <p style={{ marginBottom: '1rem' }}>
        I’ve built this site on nights and weekends, combining my love for college football with my background in data and web development. The goal is to make the Belt more accessible and engaging — with stats, history, and predictive features all in one place.
      </p>
        <p style={{ marginBottom: '1rem' }}>
        If you ever need to contact me for any reason feel free to 📨 email me at <a href="mailto:contact@cfbbelt.com">contact@cfbbelt.com</a>
      </p>
      

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Support the Site</h2>

      <p style={{ marginBottom: '1rem' }}>
        If you enjoy the site and want to help with hosting and development costs — or just buy me a coffee — I’d really appreciate it.
      </p>

      <ul>
        <li style={{ marginBottom: '0.5rem' }}>
          💵 <a href="https://www.buymeacoffee.com/cfbbelt" target="_blank" rel="noopener noreferrer">Buy Me a Coffee</a>
        </li>
       
      </ul>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        Thanks for visiting — and long live the Belt.
      </p>
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#444' }}>
  <h3>Privacy Policy</h3>
  <p>
    This site uses cookies and third-party services (such as Google AdSense) to display ads and track usage data. We do not collect personal information directly. You can manage your cookie settings via your browser.
  </p>
</div>
<p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
  <strong>FTC Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. This means that if you click on a link to a product on Amazon and make a purchase, I may receive a small commission at no additional cost to you.
</p>
      <div style={{ margin: '1.5rem 0' }}>
        <AdSlot AdSlot="9168138847" />
      </div>
    </div>
  );
}
