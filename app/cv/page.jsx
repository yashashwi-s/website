import { EB_Garamond } from "next/font/google";
import { parseResume } from "@/lib/parse-resume";
import { arrasDownloadMilestone } from "@/lib/cv-downloads.mjs";
import CVClient from "./cv-client";

/* The CV is the document in the family, so it gets the one book face rather
   than another display grotesque. It also has to survive being printed, which
   is what this page is ultimately judged as. */
const cvSerif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-cv",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Yashashwi Singhania — Resume",
  description:
    "Interactive digital resume of Yashashwi Singhania, IIT BHU. Download PDF or view online.",
};

export const revalidate = 604800;

export default async function CVPage() {
  // Retain the source document, refreshing only its verified download milestone.
  const data = parseResume();
  const milestone = await arrasDownloadMilestone();
  for (const section of data.sections) {
    if (section.type !== "projects") continue;
    for (const project of section.entries) {
      if (project.name !== "Arras") continue;
      project.bullets = project.bullets.map((bullet) => bullet.replace(/\b[\d,]+\+ downloads\b/, `${milestone.toLocaleString("en-US")}+ downloads`));
    }
  }
  // Filter out the personal website link (redundant on the web CV since they're already here)
  if (data.links) {
    data.links = data.links.filter((link) => !link.url.includes("yashashwi.me"));
  }
  return <CVClient data={data} fontClass={cvSerif.variable} />;
}
