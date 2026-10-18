import { Anton, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import HomeClient from "./home-client";
import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import { skills } from "@/data/skills";
import { repositoryStars } from "@/lib/github-release";

/* Fourth face in the house set, after Bricolage (Arras), Instrument Serif
   (PureMac index) and Space Grotesk (Fadeo). Anton is the poster face: heavy,
   condensed, and unmistakable at the sizes this page uses. Instrument Serif
   returns here only in italic, as the editorial counterweight. */
const poster = Anton({
  subsets: ["latin"],
  variable: "--font-poster",
  display: "swap",
  weight: "400",
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

const TITLE = "Yashashwi Singhania — systems, RL, and native macOS apps";
const DESCRIPTION =
  "Creator of Arras, a free Mac app for photo widgets, editable collages and slideshows. IIT (BHU) dual-degree student building native apps, systems software and reinforcement-learning projects.";

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
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function Home() {
  // Featured order drives the work list; everything else falls into "Also built".
  const ordered = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const arrasStars = await repositoryStars("Arras");

  return (
    <HomeClient
      personal={personal}
      projects={ordered}
      experience={experience}
      achievements={achievements}
      skills={skills}
      arrasStars={arrasStars}
      fontClass={`${poster.variable} ${editorial.variable} ${mono.variable}`}
    />
  );
}
