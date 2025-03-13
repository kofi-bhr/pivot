# 🚀 Welcome to PIVOT!

Hey there, future political analyst! 👋 This is your friendly guide to our PIVOT codebase. Don't worry if you're not a tech wizard - this README is designed to help you understand what's going on without getting lost in the coding jargon.

## 🏠 What's PIVOT All About?

PIVOT (Policy Insights and Voices of Tomorrow) is a novel non-profit that transforms high school students into published political analysts. Everyone has opinions, so why not make them heard?

In an era of toxic political division, PIVOT stands as a powerful counterforce. We don't just publish student opinions—we're cultivating the next generation of policy insights that cut through polarizing noise with clarity and conviction.

🔹 PIVOT delivers:
- A prestigious publishing platform exclusively for high school policy thinkers
- Rigorous editorial mentorship that demands excellence
- Direct engagement with challenging political viewpoints
- Access to a network of ambitious, politically-engaged peers

Are you a high schooler or college student ready to make your voice heard beyond classroom walls? Do you lead an organization of young political thinkers? PIVOT is actively seeking bold voices and strategic partners.

Connect with PIVOT now to join a movement that is redefining youth engagement in politics. We're not just publishing articles: we are building tomorrow's political landscape.

## 🔍 Where to Find Stuff

Think of our codebase like a well-organized house:

### 📱 The Front Door (`src/app`)
This is what users see when they visit our site. The main pages are:
- **Homepage** (`src/app/page.tsx`) - Our welcome mat
- **Articles** (`src/app/articles`) - All our content lives here
- **About** (`src/app/about`) - Who we are and what we do
- **Admin** (`src/app/admin`) - Where we manage content (password protected!)

### 🧩 The Furniture (`src/components`)
These are the reusable pieces that make up our pages:
- **Layout** (`src/components/layout`) - Headers, footers, navigation
- **Articles** (`src/components/articles`) - Article cards, sharing buttons
- **Comments** (`src/components/comments`) - User interaction stuff

### 🗄️ The Storage Room (`src/lib`)
This is where we keep helper functions and database connections.

### 🎨 The Paint (`src/styles`)
All the colors, fonts, and visual stuff that makes our site look good.

### 📦 The Basement (`public`)
Images, icons, and other static files live here.

## 🔌 The Database

We're using Supabase as our database (think of it as our digital filing cabinet). All our content, user data, and settings are stored there. The connection details are in the `.env.local` file, but you don't need to touch that unless you're setting up a new development environment.

## 🚀 How to Make Changes

If you need to make changes to the site:

1. **Content Updates**: Use the admin panel at `/admin` (you'll need login credentials)
2. **Design Changes**: Talk to our developer about updating components in `src/components`
3. **New Features**: These require planning with the tech team

## 🧠 Common Questions You Might Have

### "I want to add a new page to the site!"
Cool! We'd need to create a new folder in `src/app` with a `page.tsx` file.

### "How do we change the site colors/branding?"
Most styling is in the component files, with global styles in `src/app/globals.css`.

### "Where are the images stored?"
All images are in the `public` folder, and you can reference them in code like `/image-name.png`.

### "How do articles get published?"
Articles are stored in our Supabase database and managed through the admin panel.

## 🤝 Need Help?

If you're stuck or curious about something in the code:
1. Ask our developer (that's what we're here for!)
2. Check out the Next.js docs at [nextjs.org](https://nextjs.org) if you're feeling adventurous
3. Look at similar components in the codebase for inspiration

Remember: You don't need to understand every line of code to make meaningful contributions to PIVOT. Focus on the vision, and the tech team will handle the implementation details!

## 🏃‍♂️ Running the Site Locally

If you want to see the site on your own computer:

```bash
# Install dependencies (only need to do this once)
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Let's Build Something Amazing Together!

Remember, this codebase is just a tool to bring our vision to life. Don't get caught up in the technical details - focus on the impact we're making for young political thinkers!
