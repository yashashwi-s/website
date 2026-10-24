import { arrasCanonicalUrl } from "@/data/arras-product";
import { ArrasNavigation, ArrasFooter } from "./arras-navigation";
import "./arras.css";

export function supportMetadata(path, title, description) {
  const url = `${arrasCanonicalUrl}/${path}`;
  return {
    title, description, metadataBase: new URL(arrasCanonicalUrl),
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 } },
    openGraph: { title, description, url, siteName: "Arras", type: "website", images: [{ url: `${arrasCanonicalUrl}/puremac/arras/launch-2.5.0-poster.jpg`, alt: "Arras photo widgets on a Mac desktop" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: `${arrasCanonicalUrl}/puremac/arras/launch-2.5.0-poster.jpg`, alt: "Arras photo widgets on a Mac desktop" }] },
  };
}

export default function SupportPage({ links, active, label, title, intro, sections, children, pageType = "WebPage", headerAside }) {
  const url = `${arrasCanonicalUrl}/${active === "faqs" ? "faq" : active}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": pageType, "@id": `${url}#page`, url, name: label, description: intro,
        isPartOf: { "@id": `${arrasCanonicalUrl}/#website` },
        about: { "@id": `${arrasCanonicalUrl}#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` } },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Arras", item: `${arrasCanonicalUrl}/` },
        { "@type": "ListItem", position: 2, name: label, item: url },
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
        <aside><nav aria-label="On this page"><p className="ar-label">On this page</p>{sections.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav></aside>
        <article className="ar-document-body">{children}</article>
      </div>
      <ArrasFooter links={links} />
    </main>
  );
}
