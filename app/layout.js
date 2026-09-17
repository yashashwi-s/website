import "./globals.css";
import { personal } from "@/data/personal";

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

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans text-white cursor-none overflow-x-hidden selection:bg-white/30 selection:text-white">
        <div className="noise-bg" />
        {children}
        {process.env.VERCEL === "1" && <Analytics />}
        {process.env.VERCEL === "1" && <SpeedInsights />}
      </body>
    </html>
  );
}
