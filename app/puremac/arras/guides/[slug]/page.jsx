import Image from "next/image";
import { notFound } from "next/navigation";
import { arrasCanonicalUrl, arrasProduct } from "@/data/arras-product";
import { getArrasLinks } from "../../arras-links";
import SupportPage, { supportMetadata } from "../../support-page";
import { guides } from "../guide-data";

export function generateStaticParams() {
  return Object.keys(guides).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = Object.hasOwn(guides, slug) ? guides[slug] : null;
  if (!guide) notFound();
  return supportMetadata(`guides/${slug}`, `${guide.title} | Arras`, guide.description);
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = Object.hasOwn(guides, slug) ? guides[slug] : null;
  if (!guide) notFound();
  const links = await getArrasLinks();
  const path = `guides/${slug}`;
  const url = `${arrasCanonicalUrl}/${path}`;
  const article = { "@context": "https://schema.org", "@type": "Article", url,
    mainEntityOfPage: { "@id": `${url}#page` }, headline: guide.title,
    description: guide.description, datePublished: "2026-11-06", dateModified: "2026-11-06",
    author: { "@type": "Person", "@id": "https://yashashwi.me/#person", name: "Yashashwi Singhania", url: "https://yashashwi.me/" },
    image: `${arrasCanonicalUrl}/puremac/arras/features/${guide.image}.webp` };
  return <SupportPage links={links} active={path} label="Desktop guide" title={guide.title} intro={guide.description}
    sections={guide.sections.map(section => [section.id, section.title])}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }} />
    <p className="ar-fine">By Yashashwi Singhania, the maker of Arras. Updated 6 November 2026.</p>
    <figure className="ar-desktop-shot"><Image src={`/puremac/arras/features/${guide.image}.webp`} width={1470} height={956} sizes="(max-width: 800px) 100vw, 900px" alt={guide.alt} /><figcaption>{guide.caption}</figcaption></figure>
    {guide.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
    <p><a href={`${links.home}#install`}>Choose the free download or Mac App Store edition →</a></p>
    <p className="ar-fine"><a href={arrasProduct.documentation.featureContractUrl} referrerPolicy="origin">Arras feature documentation ↗</a> · <a href={links.faqs}>Setup questions</a> · <a href={links.security}>Privacy and permissions</a></p>
    <h2>More desktop workflows</h2><p><a href={links.guides}>Browse all Arras guides</a></p><ul>{Object.entries(guides).filter(([key]) => key !== slug).map(([key, value]) => <li key={key}><a href={`${links.home}guides/${key}`}>{value.title}</a></li>)}</ul>
  </SupportPage>;
}
