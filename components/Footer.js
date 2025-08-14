import { FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer style={styles.footer}>
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
    </footer>
  );
}

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '20px 0',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
  },
  iconLink: {
    color: '#000',
    textDecoration: 'none',
  },
};
