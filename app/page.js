import { Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import HomeClient from "./home-client";
import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import { skills } from "@/data/skills";
import { repositoryStars } from "@/lib/github-release";

// These faces belong to the personal portfolio; product sites keep their own.
const studio = Manrope({
  subsets: ["latin"],
  variable: "--font-studio",
  display: "swap",
});

// Avoid late swaps changing the hero copy and navigation line wrapping.
const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "optional",
  weight: "400",
  style: "italic",
});

const mono = JetBrains_Mono({
  weight: "400",
  preload: false,
  subsets: ["latin"],
  variable: "--font-mono",
  display: "optional",
});

const TITLE = "Yashashwi Singhania — Curiosity, compiled.";
const DESCRIPTION =
  "Creator of Arras, a free native Mac app with 1,000+ downloads. Student at IIT (BHU), building thoughtful software, intelligent agents, and a more personal Mac.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://yashashwi.me"),
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://yashashwi.me",
    siteName: "Yashashwi Singhania",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function Home() {
  // Featured order drives the work list; everything else falls into "Also built".
  const ordered = [...projects].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  );
  const arrasStars = await repositoryStars("Arras");

  return (
    <HomeClient
      personal={personal}
      projects={ordered}
      experience={experience}
      achievements={achievements}
      skills={skills}
      arrasStars={arrasStars}
      fontClass={`${studio.variable} ${editorial.variable} ${mono.variable}`}
    />
  );
}
