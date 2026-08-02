import { Anton, Instrument_Serif } from "next/font/google";
import NotFoundClient from "./not-found-client";

const poster = Anton({ subsets: ["latin"], variable: "--font-poster", display: "swap", weight: "400" });
const editorial = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  weight: "400",
  style: "italic",
});

export const metadata = {
  title: "404 — nothing here",
  description: "That page does not exist.",
};

export default function NotFound() {
  return <NotFoundClient fontClass={`${poster.variable} ${editorial.variable}`} />;
}
