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
  "Creator of Arras Widgets for Mac. Explore my native apps, support independent development on the App Store, and see my work at IIT (BHU).";

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

  const profile = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": "https://yashashwi.me/#page", url: "https://yashashwi.me/", name: TITLE, description: DESCRIPTION, mainEntity: { "@id": "https://yashashwi.me/#person" } },
      { "@type": "Person", "@id": "https://yashashwi.me/#person", name: personal.name, url: "https://yashashwi.me/", sameAs: ["https://github.com/yashashwi-s"], description: "Creator of Arras and a dual-degree student at IIT (BHU)." },
    ],
  };
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, "\\u003c") }} />
    <HomeClient
      personal={personal}
      projects={ordered}
      experience={experience}
      achievements={achievements}
      skills={skills}
      arrasStars={arrasStars}
      fontClass={`${studio.variable} ${editorial.variable} ${mono.variable}`}
    />
    </>
  );
}
