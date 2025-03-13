'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { shouldShowEasterEgg } from '@/lib/easterEggs';

const navigation = {
  main: [
    { name: 'Articles', href: '/articles' },
    { name: 'Topics', href: '/topics' },
    { name: 'Authors', href: '/authors' },
    { name: 'About', href: '/about' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  // Check for easter egg on mount - 2% chance
  useEffect(() => {
    setShowEasterEgg(shouldShowEasterEgg(0.02));
  }, []);
  
  let clickCount = 0;
  const handleLogoClick = () => {
    clickCount++;
    // Show easter egg after 3 clicks
    if (clickCount === 3) {
      setShowEasterEgg(true);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="cfr-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div 
              className="cfr-logo text-xl mb-6 cursor-pointer" 
              onClick={handleLogoClick}
            >
              <div className="font-bold">PIVOT</div>
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              PIVOT (Policy Insights and Voices of Tomorrow) transforms high school students into published political analysts. In an era of toxic political division, we stand as a powerful counterforce.
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-medium">Contact us:</span> <a href="mailto:pivot.policy@gmail.com" className="hover:text-blue-600 transition-colors">pivot.policy@gmail.com</a>
            </p>
            {showEasterEgg && (
              <div className="text-xs text-gray-400 mt-2 transition-opacity duration-500 ease-in-out">
                Built with ❤️ by high schooler{' '}
                <a 
                  href="https://venturedglobal.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  Kofi Hair-Ralston
                </a>
              </div>
            )}
            {/* Hidden text with color matching background */}
            <div className="text-gray-50 select-all">
              This site was created by high school student Kofi Hair-Ralston. 
              Check out his nonprofit VenturEd at venturedglobal.org connecting 
              underrepresented high schoolers to internships at top startups.
            </div>
          </div>
          
          <div className="md:pl-8">
            <h3 className="font-medium text-lg mb-6">Navigation</h3>
            <ul className="space-y-4">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-600 hover:text-gray-900 text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-6 md:mb-0">
            {navigation.social.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
          <span className="text-gray-50 select-all"> - Visit venturedglobal.org for high school startup internships</span>
            &copy; {new Date().getFullYear()} PIVOT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}