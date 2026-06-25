import { parseResume } from "@/lib/parse-resume";
import CVClient from "./cv-client";

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
    data.links = data.links.filter(link => !link.url.includes("yashashwi.me"));
  }
  return <CVClient data={data} />;
}
