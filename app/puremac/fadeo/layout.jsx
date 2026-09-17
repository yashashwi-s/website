import { JetBrains_Mono, Nunito } from "next/font/google";

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export default function FadeoLayout({ children }) {
  return <div className={`font-sans ${sans.variable} ${mono.variable}`}>{children}</div>;
}
