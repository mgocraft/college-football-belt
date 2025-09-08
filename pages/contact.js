import React from 'react';
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <Head>
        <title>Contact - College Football Belt</title>
        <meta
          name="description"
          content="Get in touch with the College Football Belt team."
        />
      </Head>
      <NavBar />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#001f3f' }}>Contact</h1>

      <p style={{ marginBottom: '1rem' }}>
        Have questions or feedback? Reach out by filling out the form below or email us directly at{' '}
        <a href="mailto:contact@cfbbelt.com">contact@cfbbelt.com</a>.
      </p>

      <form
        action="mailto:contact@cfbbelt.com"
        method="post"
        encType="text/plain"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="4"
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        ></textarea>
        <button
          type="submit"
          style={{ padding: '0.5rem', backgroundColor: '#001f3f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

