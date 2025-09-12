// components/NavBar.js
import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="flex h-screen w-full items-center justify-center bg-[#001f3f]">
      <Link
        href="/"
        className="whitespace-nowrap text-6xl font-black tracking-tight text-gray-100 sm:text-7xl"
      >
        College Football Belt
      </Link>
    </header>
  );
}
