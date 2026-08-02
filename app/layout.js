import { Nunito, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { personal } from "@/data/personal";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: `${personal.name} — Portfolio`,
  description: personal.bio,
  metadataBase: new URL("https://yashashwi.me"),
  openGraph: {
    title: `${personal.name} — Portfolio`,
    description: personal.bio,
    url: "https://yashashwi.me",
    siteName: personal.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — Portfolio`,
    description: personal.bio,
  },
};

import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable} ${caveat.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans text-white cursor-none overflow-x-hidden selection:bg-white/30 selection:text-white">
        <div className="noise-bg" />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
