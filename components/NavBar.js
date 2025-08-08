// components/NavBar.js
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md px-4 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center text-sm sm:text-base">
        <Link href="/" className="text-xl font-bold hover:text-yellow-400">Home</Link>{' '}|
        {' '}<Link href="/team/allteamsrecords" className="hover:text-yellow-400">All Teams Records</Link>{' '}|
        {' '}<Link href="/about" className="hover:text-yellow-400">About</Link>{' '}|
        {' '}<Link href="/record-book" className="hover:text-yellow-400">Record Book</Link>{' '}|
        {' '}<Link href="/path-to-conference" className="hover:text-yellow-400">Path To Other Conferences</Link>{' '}|
        {' '}<Link href="/blog" className="hover:text-yellow-400">Blog</Link>{' '}|
        {' '}<Link href="https://amzn.to/46M42Fs" className="hover:text-yellow-400">Buy CFB Belts</Link>
      </div>
    </nav>
  );
}
