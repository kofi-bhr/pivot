'use client';

import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { addConsoleEasterEggs } from '@/lib/easterEggs';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add console easter eggs
    addConsoleEasterEggs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}