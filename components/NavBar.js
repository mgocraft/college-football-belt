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

    <nav className="w-full border-b border-gray-700 bg-gray-900 text-white">
      <div className="flex h-14 items-center px-4 sm:px-6">
        <Link
          href="/"
          className="text-2xl font-bold no-underline text-white transition-colors hover:text-gray-300"
        >
          College Football Belt
        </Link>
        <ul className="ml-8 flex list-none items-center gap-6 pl-0">

          {links.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-200 no-underline transition-colors hover:bg-gray-800 hover:text-white"
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-200 no-underline transition-colors hover:bg-gray-800 hover:text-white"
                >
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
