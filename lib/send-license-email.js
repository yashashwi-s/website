import nodemailer from "nodemailer";

// Gmail SMTP with an App Password (Google Account -> Security -> 2-Step Verification ->
// App Passwords), not the account's real password -- a separate, scoped, revocable
// credential. No new account, no domain, no cost; fine at this volume (Gmail's own
// sending cap is 500/day, far above what a capped giveaway or modest sales volume needs).
function transporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

// `mustActivateBy`: an ISO date string, set only for free-giveaway keys (see the promo
// route) -- included as a plain Date-formatted line in the email so it reads naturally
// regardless of the recipient's timezone assumptions.
export async function sendLicenseEmail({ to, key, amount, mustActivateBy }) {
  const from = process.env.GMAIL_USER;
  const intro = mustActivateBy
    ? "Thanks for grabbing a free Fadeo license."
    : `Thanks for supporting Fadeo${amount ? ` ($${amount})` : ""}.`;
  const activateLine = mustActivateBy
    ? `Open Fadeo, go to About, and click Enter License Key by ${new Date(mustActivateBy).toDateString()} ` +
      "(7 days from now) to activate it -- an unused free code expires after that. Once activated, it's yours for good, no more deadlines."
    : "Open Fadeo, go to About, and click Enter License Key to activate it.";
  await transporter().sendMail({
    from: `Fadeo <${from}>`,
    to,
    subject: "Your Fadeo license key",
    text: [
      intro,
      "",
      "Your lifetime license key:",
      "",
      key,
      "",
      activateLine,
      "",
      "Questions or issues? Just reply to this email.",
      "",
      "- Yashashwi",
    ].join("\n"),
  });
}
