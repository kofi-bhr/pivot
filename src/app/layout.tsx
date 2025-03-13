import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pivot - Empowering Student Entrepreneurs",
  description: "Pivot helps student entrepreneurs navigate the startup journey with resources, guidance, and community support.",
  icons: {
    icon: [
      { url: "/PIVOT-LETTERMARK@3x.png", type: "image/png" }
    ],
    apple: [
      { url: "/PIVOT-LETTERMARK@3x.png", type: "image/png" }
    ]
  },
  openGraph: {
    title: "Pivot - Empowering Student Entrepreneurs",
    description: "Pivot helps student entrepreneurs navigate the startup journey with resources, guidance, and community support.",
    images: [{ url: "/PIVOT-LETTERMARK@3x.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pivot - Empowering Student Entrepreneurs",
    description: "Pivot helps student entrepreneurs navigate the startup journey with resources, guidance, and community support.",
    images: [{ url: "/PIVOT-LETTERMARK@3x.png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/PIVOT-LETTERMARK@3x.png" />
        <link rel="apple-touch-icon" href="/PIVOT-LETTERMARK@3x.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
