import Link from 'next/link';
import { usePathname } from 'next/navigation';

const leftNavigation = [
  { name: 'Articles', href: '/articles' },
  { name: 'Topics', href: '/topics' },
];

const rightNavigation = [
  { name: 'Authors', href: '/authors' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="cfr-header bg-white">
      <div className="cfr-container">
        {/* Main navigation */}
        <div className="flex items-center justify-center py-6">
          <nav className="hidden md:flex items-center space-x-8">
            {leftNavigation.map((link) => (
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
          
          <Link href="/" className="flex items-center mx-12">
            <div className="cfr-logo text-xl">
              <div className="font-bold">PIVOT</div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
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
        
        {/* Mobile menu */}
        <div className="flex flex-wrap justify-center space-x-4 py-3 md:hidden">
          {[...leftNavigation, ...rightNavigation].map((link) => (
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
          ))}
        </div>
      </div>
    </header>
  );
}