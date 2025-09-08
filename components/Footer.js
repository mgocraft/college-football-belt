import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function fetchLastUpdated() {
      try {
        const res = await fetch('/api/last-updated');
        const data = await res.json();
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      } catch (err) {
        console.error('Failed to load last updated time', err);
      }
    }
    fetchLastUpdated();
  }, []);
  return (
    <footer style={styles.footer}>
      {lastUpdated && (
        <div style={styles.lastUpdated}>
          Last updated:{' '}
          {new Date(lastUpdated).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
      <div style={styles.linkRow}>
        <Link href="/about" style={styles.link}>
          About
        </Link>
        <Link href="/contact" style={styles.link}>
          Contact
        </Link>
        <Link href="/privacy" style={styles.link}>
          Privacy Policy
        </Link>
        <Link href="/terms" style={styles.link}>
          Terms &amp; Conditions
        </Link>
      </div>
      <div style={styles.iconRow}>
        <a
          href="https://instagram.com/thecollegefootballbelt"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.iconLink}
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://x.com/CFBBelt"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.iconLink}
        >
          <FaXTwitter size={24} />
        </a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 0',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
  },
  iconRow: {
    display: 'flex',
    gap: '16px',
  },
  iconLink: {
    color: '#000',
    textDecoration: 'none',
  },
  linkRow: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.9rem',
  },
  link: {
    color: '#000',
    textDecoration: 'none',
  },
  lastUpdated: {
    fontSize: '0.8rem',
    color: '#555',
  },
};
