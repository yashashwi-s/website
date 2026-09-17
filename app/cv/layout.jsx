import { JetBrains_Mono, Nunito } from "next/font/google";

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function CVLayout({ children }) {
  return <div className={`font-sans ${sans.variable} ${mono.variable}`}>{children}</div>;
}
