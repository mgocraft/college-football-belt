import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

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
      <div style={styles.disclosure}>
        As an Amazon Associate I earn from qualifying purchases.
      </div>
      {lastUpdated && (
        <div style={styles.lastUpdated}>
          Last updated{' '}
          {new Date(lastUpdated).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
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
  lastUpdated: {
    fontSize: '0.8rem',
    color: '#555',
  },
  disclosure: {
    fontSize: '0.9rem',
    color: '#555',
    textAlign: 'center',
  },
};
