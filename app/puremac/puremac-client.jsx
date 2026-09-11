import FaqSection from "./faq-section";
import { macProducts } from "@/data/mac-products";
import "./puremac.css";

const apps = [
  { id: "arras", name: "Arras", icon: "/puremac/arras-icon.png", category: "Your desktop, your composition", title: "A place for your photos.", description: "Put the exact photos you love on your desktop, at their own proportions. Arrange, frame, and layer each one your way.", page: "https://arras.yashashwi.me/", price: `${macProducts.arras.price} · ${macProducts.arras.license} open source`, facts: "Original aspect ratios · Per-photo styling · Photo rotation" },
  { id: "fadeo", name: "Fadeo", icon: "/puremac/fadeo-icon.png", category: "Sound that follows your workflow", title: "Less switching. More flow.", description: "Let your music follow the app, Space, or meeting you’re in. Set your own rules for when audio plays, fades, or changes.", page: "https://puremac.yashashwi.me/fadeo", price: macProducts.fadeo.price, facts: "Context-based rules · Smooth fades · Local decisions" },
];

export default function PureMacClient({ fadeo, arras, downloads = {}, faqs = [] }) {
  const releases = { fadeo, arras };
  return <div id="puremac-index"><div className="pm-wrap">
    <header className="pm-nav"><a className="pm-brand" href="https://puremac.yashashwi.me/"><img src="/puremac/mark.svg" width="35" height="39" alt="" />PureMac</a><nav aria-label="Main navigation"><a href="#apps">The apps</a><a href="https://yashashwi.me">By Yashashwi ↗</a></nav></header>
    <main>
      <section className="pm-hero"><div><p className="pm-label">Independent software for Mac</p><h1>Feels at home.<br /><span>Works your way.</span></h1><p className="pm-intro">Small, native macOS apps for the things your Mac doesn’t quite do. Thoughtful defaults. Room to make them yours.</p><a className="pm-link" href="#apps">Explore the apps ↓</a></div><div className="pm-emblem" aria-hidden="true"><img src="/puremac/mark.svg" width="210" height="234" alt="" /></div></section>
      <div className="pm-principles"><span>Native to macOS</span><span>Open source</span><span>No subscriptions</span></div>
      <section id="apps" aria-label="PureMac apps" className="pm-apps">{apps.map(app => <article className={`pm-app pm-${app.id}`} key={app.id}>
        <div className="pm-app-head"><img src={app.icon} width="84" height="84" alt="" /><div><h2>{app.name}</h2><p>{app.category}</p></div></div><h3>{app.title}</h3><p className="pm-description">{app.description}</p><p className="pm-facts">{app.facts}</p>
        <div className="pm-app-bottom"><a className="pm-button" href={app.page}>Discover {app.name}<span aria-hidden="true">↗</span></a><p>{app.price}</p><div className="pm-release"><span>{releases[app.id]?.tag || "macOS 14+"}</span>{downloads[app.id]?.total > 0 && <span>{new Intl.NumberFormat("en-US").format(downloads[app.id].total)} GitHub asset downloads</span>}</div></div>
      </article>)}</section>
      <section className="pm-note"><h2>Useful by nature.<br />Personal by design.</h2><p>No sprawling toolbox. Each app starts with a real gap and gives you control over that part of your Mac. The source is open to inspect, learn from, and build on.</p></section>
      <div className="pm-faq"><FaqSection faqs={faqs} light accent="#536e89" title="Before you download." /></div>
    </main><footer className="pm-footer"><a className="pm-brand" href="https://puremac.yashashwi.me/"><img src="/puremac/mark.svg" width="25" height="28" alt="" />PureMac</a><p>Made with intention, by <a href="https://yashashwi.me">Yashashwi</a>.</p><a href="/puremac/press.md">Press resources ↗</a><a href="https://github.com/yashashwi-s">Open source ↗</a></footer>
  </div></div>;
}
