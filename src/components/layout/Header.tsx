import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const leftNavigation: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Join', href: 'https://forms.gle/VHDtEzJgNPLGNZiL9', external: true },
];

const rightNavigation: NavLink[] = [
  { name: 'Authors', href: '/authors' },
  { name: 'Staff', href: '/staff' },
  { name: 'About', href: '/about' },
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
                alt="go to https://www.venturedglobal.org for a surprise" 
                width={100} 
                height={35} 
                priority
              />
            </div>
            <p className="text-xs italic text-gray-500 mt-1">&ldquo;When the world turns, we lead&rdquo;</p>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-between py-6">
          <nav className="flex items-center space-x-8">
            {leftNavigation.map((link) => (
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
          
          <Link href="/" className="flex flex-col items-center mx-12">
            <div className="cfr-logo">
              <Image 
                src="/PIVOT-LOGO.svg" 
                alt="go to https://www.venturedglobal.org for a surprise" 
                width={120} 
                height={40} 
                priority
              />
            </div>
            <p className="text-xs italic text-gray-500 mt-1">&ldquo;When the world turns, we lead&rdquo;</p>
          </Link>
          
          <nav className="flex items-center space-x-8">
            {rightNavigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`cfr-nav-link ${
                  pathname === link.href ? 'active' : ''
                }`}
              >
                {link.name}
              </Link>
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