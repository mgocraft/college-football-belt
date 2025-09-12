// components/NavBar.js
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
  const links = [
    { href: '/team/allteamsrecords', label: 'All Teams Records' },
    { href: '/about', label: 'About' },
    { href: '/record-book', label: 'Record Book' },
    {
      href: '/path-to-conference',
      label: 'Path To Other Conferences',
    },
    { href: '/blog', label: 'Blog' },
    {
      href: 'https://amzn.to/46M42Fs',
      label: 'Buy CFB Belts',
      external: true,
    },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.navBar}>
        <Link href="/" className={styles.title}>
          College Football Belt
        </Link>

        <ul className={styles.navList}>
          {links.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
