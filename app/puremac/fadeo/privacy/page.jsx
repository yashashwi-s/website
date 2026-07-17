import LegalPage, { LegalSection } from "../legal-page";

export const metadata = {
  title: "Privacy Policy | Fadeo",
  description:
    "How Fadeo processes local context, diagnostics, feedback, licensing and website data.",
  alternates: {
    canonical: "https://puremac.yashashwi.me/puremac/fadeo/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Privacy Policy"
      title="Your context stays on your Mac."
      summary="Fadeo needs to understand what your Mac is doing to automate audio, but that does not mean your activity needs to become someone else's dataset."
      updated="18 July 2026"
    >
      <LegalSection title="Who operates Fadeo">
        <p>
          Fadeo and the Fadeo website are operated by Yashashwi Singhania under
          PureMac. Privacy questions and deletion requests can be sent to{" "}
          <a
            href="mailto:fadeo.puremac@gmail.com"
            className="text-white/85 underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
          >
            fadeo.puremac@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="What Fadeo processes on your Mac">
        <p>
          Fadeo observes context such as the frontmost application, current
          desktop Space, whether the camera or microphone is active, Focus mode,
          schedules, workspace rules and current audio state. This information
          is used locally to decide which workspace and audio action should win.
        </p>
        <p>
          Fadeo does not record camera footage, microphone audio, calls,
          conversations or the content of applications. Camera and microphone
          detection observes whether those devices are in use, not what they
          capture.
        </p>
        <p>
          Workspace configuration, audio levels, rules and other preferences
          remain stored locally on your Mac. Fadeo does not upload the names of
          your workspaces, applications, playlists or schedules as part of its
          diagnostics.
        </p>
      </LegalSection>

      <LegalSection title="Information sent to Fadeo">
        <p>
          Fadeo can send limited information in the following situations:
        </p>
        <ul className="list-disc space-y-3 pl-5 marker:text-white/25">
          <li>
            <span className="text-white/80">License activation:</span> a license
            key is verified and, for promotional keys, its identifier may be
            recorded as activated.
          </li>
          <li>
            <span className="text-white/80">Free-license promotion:</span> an
            optional email address can be used to send a copy of the key. An IP
            address is temporarily used to enforce a daily anti-abuse limit.
          </li>
          <li>
            <span className="text-white/80">Optional diagnostics:</span> a
            random installation identifier and coarse totals such as session
            count, workspace count, switches, active time, feature categories,
            app version, macOS version and license state.
          </li>
          <li>
            <span className="text-white/80">Feedback:</span> a rating, written
            message, random installation identifier, app version and macOS
            version when you choose to submit feedback.
          </li>
          <li>
            <span className="text-white/80">Update emails:</span> your email
            address when you voluntarily subscribe on the website.
          </li>
        </ul>
        <p>
          Diagnostics and feedback do not require your name, account or email.
          Avoid including personal or sensitive information in written
          feedback.
        </p>
      </LegalSection>

      <LegalSection title="Website analytics">
        <p>
          The Fadeo website is hosted on Vercel and uses Vercel Analytics and
          Speed Insights. Vercel may process standard technical information
          such as page visits, browser or device characteristics and performance
          measurements under its own privacy terms.
        </p>
        <p>
          GitHub may process standard request and account information when you
          view the source code or download a release from GitHub.
        </p>
      </LegalSection>

      <LegalSection title="Payments and external services">
        <p>
          Payments may be processed by Gumroad, Stripe or another checkout
          provider identified at the time of purchase. Payment-card details are
          handled by that provider and are not stored by Fadeo.
        </p>
        <p>
          Fadeo can control Apple Music and Spotify installed on your Mac.
          Those products remain governed by Apple&apos;s and Spotify&apos;s own
          terms and privacy policies. Fadeo does not receive your Apple or
          Spotify password.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <ul className="list-disc space-y-3 pl-5 marker:text-white/25">
          <li>
            Giveaway IP rate-limit records expire after approximately 24 hours.
          </li>
          <li>
            Subscriber emails are retained until you unsubscribe or request
            deletion.
          </li>
          <li>
            Diagnostics retain the latest coarse snapshot associated with a
            random installation identifier rather than a detailed activity
            history.
          </li>
          <li>
            Feedback, licensing and transaction records are retained only as
            reasonably necessary to operate, support and protect Fadeo, comply
            with law and prevent abuse.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can leave optional diagnostics disabled, avoid submitting
          feedback, omit your email when claiming a promotional key and
          unsubscribe from update emails at any time.
        </p>
        <p>
          To request access, correction or deletion of information associated
          with your email or a known installation identifier, contact{" "}
          <a
            href="mailto:fadeo.puremac@gmail.com"
            className="text-white/85 underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
          >
            fadeo.puremac@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Security and disclosure">
        <p>
          Reasonable technical measures are used to protect information
          processed by Fadeo. No online system can guarantee absolute security.
        </p>
        <p>
          Personal information is not sold. Information may be disclosed when
          required by law, needed to investigate abuse or necessary for service
          providers to operate Fadeo on our behalf.
        </p>
      </LegalSection>

      <LegalSection title="Children and policy changes">
        <p>
          Fadeo is not directed to children under 13, and personal information
          from children is not knowingly collected.
        </p>
        <p>
          This policy may change as Fadeo develops. Material changes will be
          reflected on this page with a revised effective date.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
