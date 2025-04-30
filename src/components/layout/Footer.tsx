import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <Link href="/" className="flex items-center">
              <div className="relative w-24 h-10">
                <Image
                  src="/PIVOT-LOGO-WHITE.svg"
                  alt="PIVOT Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
              About
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/articles" className="text-sm leading-6 text-gray-300 hover:text-white">
              Articles
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/fellowship" className="text-sm leading-6 text-gray-300 hover:text-white">
              Fellowship
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/partners" className="text-sm leading-6 text-gray-300 hover:text-white">
              Partners
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/get-involved" className="text-sm leading-6 text-gray-300 hover:text-white">
              Get Involved
            </Link>
          </div>
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-400">
          &copy; 2025 PIVOT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}