import { ARRAS_SUPPORT_EMAIL, ARRAS_SUPPORT_MAILTO } from "@/lib/arras-support.mjs";

export default function ArrasContact({ links, compact = false }) {
  return (
    <section id="contact" className="ar-contact-card">
      <p className="ar-label">A person, on the other end.</p>
      <h2>Need a hand with Arras?</h2>
      <p>App Store purchase or free direct download: get help with a bug, ask a question, or suggest something you wish Arras could do.</p>
      <a className="ar-button" href={ARRAS_SUPPORT_MAILTO}>Email Arras support <span aria-hidden="true">↗</span></a>
      <p className="ar-fine"><a href={ARRAS_SUPPORT_MAILTO}>{ARRAS_SUPPORT_EMAIL}</a> · Yashashwi Singhania, developer of Arras.</p>
      {compact ? <p><a href={links.support}>Troubleshooting, purchases &amp; moving your library →</a></p> : <p>Include your Arras version, macOS version, which edition you use, and the steps that led to the problem. Screenshots help if you hide personal content. Keep photos and library backups out of support email.</p>}
    </section>
  );
}
