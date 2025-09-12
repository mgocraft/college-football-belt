// components/NavBar.js
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
  const links = [
    { href: '/team/allteamsrecords', label: 'All Teams Records' },
    { href: '/about', label: 'About' },
    { href: '/record-book', label: 'Record Book' },
    { href: '/path-to-conference', label: 'Path To Other Conferences' },
    { href: '/blog', label: 'Blog' },
    {
      href: 'https://amzn.to/46M42Fs',
      label: 'Buy CFB Belts',
      external: true,
    },
  ];

  return (

    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          College Football Belt
        </Link>
        <ul className={styles.links}>
          {links.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className={styles.link}>
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
