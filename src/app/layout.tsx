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
  title: "PIVOT - Policy Insights and Voices of Tomorrow",
  description: "PIVOT transforms high school students into published political analysts, cultivating the next generation of policy insights that cut through polarizing noise with clarity and conviction.",
  icons: {
    icon: [
      { url: "/PIVOT-LETTERMARK@3x.png", type: "image/png" }
    ],
    apple: [
      { url: "/PIVOT-LETTERMARK@3x.png", type: "image/png" }
    ]
  },
  openGraph: {
    title: "PIVOT - Policy Insights and Voices of Tomorrow",
    description: "PIVOT transforms high school students into published political analysts, cultivating the next generation of policy insights that cut through polarizing noise with clarity and conviction.",
    images: [{ url: "/PIVOT-LETTERMARK@3x.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIVOT - Policy Insights and Voices of Tomorrow",
    description: "PIVOT transforms high school students into published political analysts, cultivating the next generation of policy insights that cut through polarizing noise with clarity and conviction.",
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
