import { arrasCanonicalUrl } from "@/data/arras-product";
import { ArrasNavigation, ArrasFooter } from "./arras-navigation";
import "./arras.css";

export function supportMetadata(path, title, description, { ogImage, noindex = false } = {}) {
  const url = `${arrasCanonicalUrl}/${path}`;
  const image = `${arrasCanonicalUrl}${ogImage || "/puremac/arras/launch-2.5.0-poster.jpg"}`;
  const robots = noindex
    ? { index: false, follow: true, googleBot: { index: false, follow: true } }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 } };
  return {
    title, description, metadataBase: new URL(arrasCanonicalUrl),
    alternates: { canonical: url },
    other: { "apple-itunes-app": "app-id=6824271927" },
    robots,
    openGraph: { title, description, url, siteName: "Arras", type: "website", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
  };
}

export default function SupportPage({ links, active, label, title, intro, sections, children, pageType = "WebPage", headerAside }) {
  const url = `${arrasCanonicalUrl}/${active === "faqs" ? "faq" : active}`;
  const schemaName = typeof title === "string" && title.trim() ? title : label;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": pageType, "@id": `${url}#page`, url, name: schemaName, description: intro,
        isPartOf: { "@id": `${arrasCanonicalUrl}/#website` },
        about: { "@id": `${arrasCanonicalUrl}#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` } },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Arras", item: `${arrasCanonicalUrl}/` },
        { "@type": "ListItem", position: 2, name: schemaName, item: url },
      ] },
    ],
  };
  return (
    <main id="arras-page" className="ar-support">
      <ArrasNavigation links={links} active={active} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header id="arras-content" tabIndex={-1} className={`ar-wrap ar-support-header${headerAside ? " ar-support-header-split" : ""}`}>
        <div>
        <nav className="ar-breadcrumb" aria-label="Breadcrumb"><a href={links.home}>Arras</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
        <p className="ar-label">{label}</p>
        <h1>{title}</h1>
        <p className="ar-intro">{intro}</p>
        </div>
        {headerAside}
      </header>
      <div className="ar-wrap ar-document">
        <aside><nav aria-label="On this page"><p className="ar-label">On this page</p>{sections.map(([id, sectionTitle]) => <a key={id} href={`#${id}`}>{sectionTitle}</a>)}</nav></aside>
        <article className="ar-document-body">{children}</article>
      </div>
      <ArrasFooter links={links} />
    </main>
  );
}
