import Image from "next/image";
import { arrasCanonicalUrl } from "@/data/arras-product";
import { getArrasLinks } from "../arras-links";
import { ArrasFooter, ArrasNavigation } from "../arras-navigation";
import { supportMetadata } from "../support-page";
import { guides } from "./guide-data";
import "../arras.css";

export const revalidate = 3600;

const title = "Mac Desktop Photo Widget & Collage Guides | Arras";
const description = "Step-by-step Mac guides for uncropped photo widgets, editable desktop collages, folder slideshows, animated GIFs, floating references, and monochrome widget fixes.";
export const metadata = supportMetadata("guides", title, description);

export default async function GuidesPage() {
  const links = await getArrasLinks();
  const entries = Object.entries(guides);
  const url = `${arrasCanonicalUrl}/guides`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${arrasCanonicalUrl}/#website` },
        about: { "@id": `${arrasCanonicalUrl}#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#list`,
        itemListElement: entries.map(([slug, guide], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guide.title,
          url: `${arrasCanonicalUrl}/guides/${slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Arras", item: `${arrasCanonicalUrl}/` },
          { "@type": "ListItem", position: 2, name: "Guides", item: url },
        ],
      },
    ],
  };

  return (
    <main id="arras-page" className="ar-support">
      <ArrasNavigation links={links} active="guides" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header id="arras-content" tabIndex={-1} className="ar-wrap ar-support-header">
        <nav className="ar-breadcrumb" aria-label="Breadcrumb">
          <a href={links.home}>Arras</a><span aria-hidden="true">/</span><span aria-current="page">Guides</span>
        </nav>
        <h1>Mac desktop photo widget guides</h1>
        <p className="ar-intro">{description}</p>
      </header>
      <ul className="ar-wrap ar-guide-grid" aria-label="Arras guides">
        {entries.map(([slug, guide]) => (
          <li key={slug}>
            <a href={`${links.guides}/${slug}`}>
              <Image src={`/puremac/arras/features/${guide.image}.webp`} width={1470} height={956}
                sizes="(max-width: 650px) 94vw, (max-width: 1000px) 44vw, 380px" alt={guide.alt} />
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
