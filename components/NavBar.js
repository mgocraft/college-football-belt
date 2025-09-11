// components/NavBar.js
import Link from 'next/link';

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
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white shadow-md mb-8">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">
          College Football Belt
        </Link>

        <ul className="flex items-center space-x-4 sm:space-x-8 text-sm sm:text-base list-none">

          {links.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 hover:text-blue-300 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  className="px-2 py-1 hover:text-blue-300 transition-colors"
                >
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
