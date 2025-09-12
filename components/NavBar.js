// components/NavBar.js
import Link from 'next/link';

export default function NavBar() {
  return (
    <header className="w-full min-h-screen bg-blue-900 flex items-center justify-center text-slate-100">
      <Link href="/" className="text-5xl font-extrabold tracking-tight">
        College Football Belt
      </Link>
    </header>
  );
}
