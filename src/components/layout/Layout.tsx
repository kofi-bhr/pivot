'use client';

import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { addConsoleEasterEggs, initTitleChangeEasterEgg } from '@/lib/easterEggs';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add console easter eggs
    addConsoleEasterEggs();
    
    // Initialize title change easter egg with cleanup
    const cleanupTitleChange = initTitleChangeEasterEgg();
    
    // Cleanup on unmount
    return () => {
      cleanupTitleChange();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}