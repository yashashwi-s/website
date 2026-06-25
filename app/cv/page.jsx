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
  return <CVClient data={data} />;
}
