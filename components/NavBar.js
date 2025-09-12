// components/NavBar.js
import Link from 'next/link';

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
    <nav className="w-full bg-white border-b border-gray-200 text-gray-800">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-semibold">
          College Football Belt
        </Link>
        <div className="flex space-x-6">
          {links.map(({ href, label, external }) => (
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gray-600"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-gray-600"
              >
                {label}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
