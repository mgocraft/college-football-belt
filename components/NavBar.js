// components/NavBar.js
import Link from 'next/link';
import AmazonBanner from './AmazonBanner';

export default function NavBar() {
  const links = [
    { href: '/', label: 'Home', className: 'text-xl font-bold' },
    { href: '/team/allteamsrecords', label: 'All Teams Records' },
    { href: '/about', label: 'About' },
    { href: '/record-book', label: 'Record Book' },
    { href: '/path-to-conference', label: 'Path To Other Conferences' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg mb-6">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base">
        {links.map(({ href, label, className }) => (
          <Link
            key={href}
            href={href}
            className={`${className || ''} hover:text-yellow-400 transition-colors`}
          >
            {label}
          </Link>
        ))}
        <a
          href="https://amzn.to/46M42Fs"
          className="hover:text-yellow-400 transition-colors"
        >
          Buy CFB Belts
        </a>
      </nav>
      <AmazonBanner />
    </header>
  );
}
