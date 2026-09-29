import { arrasCanonicalUrl } from "@/data/arras-product";
import { ArrasNavigation, ArrasFooter } from "./arras-navigation";
import "./arras.css";

export function supportMetadata(path, title, description) {
  const url = `${arrasCanonicalUrl}/${path}`;
  return {
    title, description, metadataBase: new URL(arrasCanonicalUrl),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "Arras", type: "website", images: ["/puremac/arras/demo-poster.jpg"] },
    twitter: { card: "summary_large_image", title, description, images: ["/puremac/arras/demo-poster.jpg"] },
  };
}

export default function SupportPage({ links, active, label, title, intro, sections, children }) {
  return (
    <main id="arras-page" className="ar-support">
      <ArrasNavigation links={links} active={active} />
      <header className="ar-wrap ar-support-header">
        <p className="ar-label">{label}</p>
        <h1>{title}</h1>
        <p className="ar-intro">{intro}</p>
      </header>
      <div className="ar-wrap ar-document">
        <aside><nav aria-label="On this page"><p className="ar-label">On this page</p>{sections.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav></aside>
        <article className="ar-document-body">{children}</article>
      </div>
      <ArrasFooter links={links} />
    </main>
  );
}
