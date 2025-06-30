import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { FadeIn } from "@/components/animation/FadeIn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
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
        {/* Icons and manifest are handled by the metadata object */}
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <FadeIn>{children}</FadeIn>
      </body>
    </html>
  );
}
