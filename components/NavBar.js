// components/NavBar.js
import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="bg-gradient-to-br from-slate-900 to-blue-700 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            College Football Belt
          </Link>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-200 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex space-x-6">
            {links.map(({ href, label, external }) => (
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-blue-200"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-blue-200"
                >
                  {label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pb-3 space-y-1">
          {links.map(({ href, label, external }) => (
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-800"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-800"
              >
                {label}
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  );
}
