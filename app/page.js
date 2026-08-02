import { Anton, Instrument_Serif } from "next/font/google";
import HomeClient from "./home-client";
import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import { skills } from "@/data/skills";

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

const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  weight: "400",
  style: "italic",
});

const TITLE = "Yashashwi Singhania — systems, RL, and native macOS apps";
const DESCRIPTION =
  "Dual-degree student at IIT (BHU) writing reinforcement learning, systems code and native macOS apps. Selected work, experience and the things that came out of it.";

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

export default function Home() {
  // Featured order drives the work list; everything else falls into "Also built".
  const ordered = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <HomeClient
      personal={personal}
      projects={ordered}
      experience={experience}
      achievements={achievements}
      skills={skills}
      fontClass={`${poster.variable} ${editorial.variable}`}
    />
  );
}
