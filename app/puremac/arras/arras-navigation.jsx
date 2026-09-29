import { arrasProduct } from "@/data/arras-product";

export function ArrasNavigation({ links, active }) {
  return (
    <nav className="ar-wrap ar-nav" aria-label="Main navigation">
      <a className="ar-brand" href={links.home}><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />Arras<span>FOR MAC</span></a>
      <div>
        <a href={links.faqs} aria-current={active === "faqs" ? "page" : undefined}>FAQs</a>
        <a href={links.security} aria-current={active === "security" ? "page" : undefined}>Security &amp; Privacy</a>
        <a className="ar-nav-download" href={`${links.home}#install`}>Get Arras ↓</a>
      </div>
    </nav>
  );
}

export function ArrasFooter({ links }) {
  return (
    <footer className="ar-wrap ar-footer">
      <a className="ar-brand" href={links.home}><img src="/puremac/arras/mark.svg" width="34" height="30" alt="" />Arras</a>
      <p>Small by intention. Yours by design.</p>
      <div><a href={links.faqs}>FAQs</a><a href={links.security}>Security &amp; Privacy</a><a href={arrasProduct.repositoryUrl}>Source ↗</a><a href="https://yashashwi.me">Yashashwi ↗</a></div>
    </footer>
  );
}
