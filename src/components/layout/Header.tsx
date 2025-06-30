'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const leftNavigation: NavLink[] = [
  { name: 'Articles', href: '/articles' },
  { name: 'Policy', href: '/briefs' },
  { name: 'Join', href: '/get-involved' },
];

const rightNavigation: NavLink[] = [
  { name: 'People', href: '/people' },
  { name: 'Staff', href: '/staff' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="cfr-header bg-white">
      <div className="cfr-container">
        {/* Top spacing */}
        <div className="h-6"></div>
        
        {/* Mobile logo only */}
        <div className="flex justify-center py-4 md:hidden">
          <Link href="/" className="flex flex-col items-center">
            <div className="cfr-logo">
              <Image 
                src="/PIVOT-LOGO.svg" 
                alt="PIVOT Logo" 
                width={100} 
                height={40} 
                priority
              />
            </div>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-between py-6">
          {/* Logo on the left */}
          <Link href="/" className="flex-shrink-0">
            <div className="cfr-logo">
              <Image 
                src="/PIVOT-LOGO.svg" 
                alt="PIVOT Logo" 
                width={100} 
                height={40} 
                priority
              />
            </div>
          </Link>
          
          {/* Combined navigation on the right */}
          <nav className="flex items-center space-x-8">
            {[...leftNavigation, ...rightNavigation].map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cfr-nav-link"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`cfr-nav-link ${
                    pathname === link.href ? 'active' : ''
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
        </div>
        
        {/* Mobile menu - only navigation links, no duplicate header */}
        <div className="flex flex-wrap justify-center space-x-4 py-3 md:hidden">
          {[...leftNavigation, ...rightNavigation].map((link) => (
            link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </header>
  );
}