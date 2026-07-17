import LegalPage, { LegalSection } from "../legal-page";

export const metadata = {
  title: "Terms of Service | Fadeo",
  description:
    "Terms governing downloads, licenses, promotions and use of Fadeo.",
  alternates: {
    canonical: "https://puremac.yashashwi.me/puremac/fadeo/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="Terms of Service"
      title="Clear terms, without pretending software is magic."
      summary="These terms govern your use of Fadeo, its website, license system and related services."
      updated="18 July 2026"
    >
      <LegalSection title="Acceptance">
        <p>
          By downloading, installing, purchasing, activating or using Fadeo,
          you agree to these terms. Do not use Fadeo if you do not agree.
        </p>
        <p>
          Fadeo requires macOS 14 or later. Some features also require
          compatible versions of macOS, Apple Music, Spotify or related system
          services.
        </p>
      </LegalSection>

      <LegalSection title="Open-source software and licenses">
        <p>
          Fadeo&apos;s source code is distributed under the GNU General Public
          License version 3. Your rights to use, inspect, modify and distribute
          that source code are governed by the GPLv3, which takes precedence
          where these terms conflict with rights granted by that license.
        </p>
        <p>
          The downloadable build remains functional without purchasing a
          license. A Fadeo lifetime license is an optional one-time purchase
          that removes the small occasional license reminder.
        </p>
        <p>
          The current minimum license price is $2, with the option to pay more.
          The exact amount and payment provider are displayed before purchase.
          A lifetime license is not a subscription, but it does not guarantee
          perpetual development, hosting, support or compatibility with every
          future macOS release.
        </p>
      </LegalSection>

      <LegalSection title="Promotional licenses">
        <p>
          Fadeo may offer a limited number of promotional lifetime licenses,
          including the first-100-users promotion. Availability is limited and
          is not guaranteed until a valid key has been issued.
        </p>
        <p>
          Promotional keys may need to be activated within seven days. An
          unused key may expire and return to the available pool. Automated
          claiming, circumvention of limits, resale and fraudulent or duplicate
          claims are prohibited.
        </p>
        <p>
          A promotional offer may be modified or ended when reasonably
          necessary to prevent abuse, correct technical problems or comply with
          law. A properly activated license will not be revoked merely because
          the promotion later ends.
        </p>
      </LegalSection>

      <LegalSection title="Payments and refunds">
        <p>
          Purchases may be handled by Gumroad, Stripe or another provider shown
          at checkout. Their payment terms may also apply.
        </p>
        <p>
          Questions or refund requests should be sent to{" "}
          <a
            href="mailto:fadeo.puremac@gmail.com"
            className="text-white/85 underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
          >
            fadeo.puremac@gmail.com
          </a>
          . Refunds will be handled reasonably and in accordance with
          applicable consumer law and the payment provider&apos;s requirements.
        </p>
      </LegalSection>

      <LegalSection title="Permitted use">
        <p>
          You may use Fadeo for lawful personal or professional purposes,
          subject to the GPLv3 for the open-source code and these terms for the
          website, hosted services, promotional system and issued license keys.
        </p>
        <p>You may not:</p>
        <ul className="list-disc space-y-3 pl-5 marker:text-white/25">
          <li>
            Abuse, overload, scrape or interfere with Fadeo&apos;s website,
            licensing, feedback, subscription or diagnostic services.
          </li>
          <li>
            Attempt to obtain promotional licenses through automation, false
            identities or circumvention of technical limits.
          </li>
          <li>
            Misrepresent Fadeo, its developer, your relationship to the project
            or the origin of a modified build.
          </li>
          <li>
            Redistribute Fadeo in a way that violates the GPLv3 or applicable
            law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          Fadeo can interact with macOS, Apple Music, Spotify, GitHub and
          payment providers. Those services are controlled by third parties and
          remain subject to their own terms, policies, availability and
          technical restrictions.
        </p>
        <p>
          Fadeo is not affiliated with or endorsed by Apple or Spotify.
          Changes made by third parties may temporarily or permanently affect
          certain features.
        </p>
      </LegalSection>

      <LegalSection title="Updates and availability">
        <p>
          Fadeo may be updated, changed, suspended or discontinued. Features
          that rely on undocumented or changing operating-system behavior may
          stop working after a macOS update.
        </p>
        <p>
          There is no promise that every issue will be fixed, every feature
          request will be implemented or support will be available within a
          particular timeframe.
        </p>
      </LegalSection>

      <LegalSection title="Warranty disclaimer">
        <p>
          To the fullest extent permitted by law, Fadeo and its related
          services are provided “as is” and “as available,” without warranties
          of uninterrupted operation, error-free behavior, fitness for a
          particular purpose or compatibility with every device, application
          or operating-system version.
        </p>
        <p>
          Nothing in these terms excludes warranties or consumer rights that
          cannot legally be excluded.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, the developer will not be
          liable for indirect, incidental, special or consequential losses,
          including lost data, lost profits, interrupted work or problems
          caused by third-party services.
        </p>
        <p>
          Where liability cannot be excluded, total liability relating to
          Fadeo will not exceed the amount you paid for the relevant license,
          except where applicable law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Suspension and termination">
        <p>
          Access to hosted services or promotional systems may be limited or
          terminated for abuse, fraud, security threats or material violations
          of these terms. Termination of hosted access does not remove rights
          already granted to source code under the GPLv3.
        </p>
      </LegalSection>

      <LegalSection title="Governing law and changes">
        <p>
          These terms are governed by the laws of India, subject to mandatory
          consumer protections and other laws that apply where you live.
        </p>
        <p>
          These terms may be updated as Fadeo develops. Material changes will
          appear on this page with a revised effective date. Continued use
          after an update means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a
            href="mailto:fadeo.puremac@gmail.com"
            className="text-white/85 underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
          >
            fadeo.puremac@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
