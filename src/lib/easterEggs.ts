'use client';

// Easter eggs for Kofi Hair-Ralston and VenturEd
// These are subtle and only trigger occasionally

// Constants
const VENTURED_URL = 'https://venturedglobal.org';
const KOFI_NAME = 'Kofi Hair-Ralston';

// Random chance helpers
export const shouldShowEasterEgg = (probability: number): boolean => {
  return Math.random() < probability;
};

// Console easter eggs
export const addConsoleEasterEggs = (): void => {
  // Only run on client
  if (typeof window === 'undefined') return;
  
  // Add a hidden console message that appears when someone opens dev tools
  console.log(
    '%c👋 Hello curious developer!',
    'font-size: 20px; font-weight: bold; color: #293A4A;'
  );
  
  setTimeout(() => {
    console.log(
      '%cPsst... Did you know this site was created by high schooler Kofi Hair-Ralston?',
      'font-size: 14px; color: #293A4A;'
    );
  }, 1000);
  
  setTimeout(() => {
    console.log(
      `%cCheck out his nonprofit VenturEd connecting high schoolers to startup internships: ${VENTURED_URL}`,
      'font-size: 14px; color: #293A4A; text-decoration: underline;'
    );
  }, 2000);
};

// Title change easter egg
export const initTitleChangeEasterEgg = (): () => void => {
  // Only run on client
  if (typeof window === 'undefined') return () => {};
  
  const originalTitle = document.title;
  let isChanging = false;
  
  const intervalId = setInterval(() => {
    // 1% chance every second to change the title
    if (shouldShowEasterEgg(0.01) && !isChanging) {
      isChanging = true;
      document.title = "✨ GO TO VENTUREDGLOBAL.ORG ✨";
      
      // Change back after 3 seconds
      setTimeout(() => {
        document.title = originalTitle;
        isChanging = false;
      }, 3000);
    }
  }, 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Generate a Kofi comment for articles
export const generateKofiComment = (articleId: number) => {
  // Only show this easter egg 5% of the time
  if (!shouldShowEasterEgg(0.05)) return null;
  
  const comments = [
    `That's pretty cool, but you know what else is cool? Free high school startup internships! Check out ${VENTURED_URL}`,
    `Great article! Reminds me of some of the amazing work high schoolers do at startups through VenturEd.`,
    `As a high schooler who built this site, I love seeing content like this. If you're a high schooler interested in tech, visit ${VENTURED_URL}!`,
    `Interesting perspective! At VenturEd, we connect high schoolers with opportunities just like this.`,
    `This is the kind of content that inspires the next generation of founders. Speaking of which, check out ${VENTURED_URL} if you're a high schooler looking for startup experience!`
  ];
  
  return {
    id: `kofi-easter-egg-${Date.now()}`,
    article_id: articleId,
    commenter_name: KOFI_NAME,
    content: comments[Math.floor(Math.random() * comments.length)],
    created_at: new Date().toISOString(),
    is_easter_egg: true
  };
};
