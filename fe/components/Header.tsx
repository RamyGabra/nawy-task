import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
          <Image
            src="/nawy-logo.png"
            alt="Nawy Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
      </div>
    </header>
  );
}

