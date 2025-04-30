'use client';

// Easter eggs for Kofi Hair-Ralston and VenturEd

// Constants
const VENTURED_URL = 'https://venturedglobal.org';
const KOFI_NAME = 'Kofi Hair-Ralston';

// Console easter eggs
export const addConsoleEasterEggs = (): void => {
  const styles = [
    'color: #3B82F6',
    'font-size: 14px',
    'font-weight: bold',
    'padding: 8px',
  ].join(';');

  console.log(
    '%cPsst... Did you know this site was created by high schooler Kofi Hair-Ralston?',
    styles
  );

  console.log(
    `%cCheck out his nonprofit VenturEd connecting high schoolers to startup internships: ${VENTURED_URL}`,
    styles
  );
};
