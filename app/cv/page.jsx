import { EB_Garamond } from "next/font/google";
import { parseResume } from "@/lib/parse-resume";
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

export default function CVPage() {
  // This runs at BUILD TIME — reads resume.tex and parses it
  const data = parseResume();
  // Filter out the personal website link (redundant on the web CV since they're already here)
  if (data.links) {
    data.links = data.links.filter((link) => !link.url.includes("yashashwi.me"));
  }
  return <CVClient data={data} fontClass={cvSerif.variable} />;
}
