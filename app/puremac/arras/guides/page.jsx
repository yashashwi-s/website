import Image from "next/image";
import { getArrasLinks } from "../arras-links";
import { ArrasFooter, ArrasNavigation } from "../arras-navigation";
import { supportMetadata } from "../support-page";
import { guides } from "./guide-data";
import "../arras.css";

const description = "Put an uncropped photo on your Mac desktop, make an editable collage, or keep reference images above your apps.";
export const metadata = supportMetadata("guides", "Arras Guides for Mac", description);

export default async function GuidesPage() {
  const links = await getArrasLinks();
  return (
    <main id="arras-page" className="ar-support">
      <ArrasNavigation links={links} active="guides" />
      <header id="arras-content" tabIndex={-1} className="ar-wrap ar-support-header">
        <nav className="ar-breadcrumb" aria-label="Breadcrumb">
          <a href={links.home}>Arras</a><span aria-hidden="true">/</span><span aria-current="page">Guides</span>
        </nav>
        <h1>Arras guides</h1>
        <p className="ar-intro">{description}</p>
      </header>
      <ul className="ar-wrap ar-guide-grid" aria-label="Arras guides">
        {Object.entries(guides).map(([slug, guide]) => (
          <li key={slug}>
            <a href={`${links.guides}/${slug}`}>
              <Image src={`/puremac/arras/features/${guide.image}.webp`} width={1470} height={956}
                sizes="(max-width: 650px) 94vw, (max-width: 1000px) 44vw, 380px" alt="" />
              <div className="ar-guide-copy">
                <h2>{guide.title}</h2>
                <p>{guide.description}</p>
                <span aria-hidden="true">Read guide →</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <ArrasFooter links={links} />
    </main>
  );
}
