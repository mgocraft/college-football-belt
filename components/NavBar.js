// components/NavBar.js
import Link from 'next/link';

export default function NavBar() {
  const links = [
    { href: '/', label: 'Home', className: 'text-xl font-bold' },
    { href: '/team/allteamsrecords', label: 'All Teams Records', className: '' },
    { href: '/about', label: 'About', className: '' },
    { href: '/record-book', label: 'Record Book', className: '' },
    {
      href: '/path-to-conference',
      label: 'Path To Other Conferences',
      className: '',
    },
    { href: '/blog', label: 'Blog', className: '' },
    {
      href: 'https://amzn.to/46M42Fs',
      label: 'Buy CFB Belts',
      className: '',
      external: true,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg mb-6">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base">
        {links.map(({ href, label, className, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${className || ''} hover:text-yellow-400 transition-colors`}
            >
              {label}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className={`${className || ''} hover:text-yellow-400 transition-colors`}
            >
              {label}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
