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

export async function sendLicenseEmail({ to, key, amount }) {
  const from = process.env.GMAIL_USER;
  await transporter().sendMail({
    from: `Fadeo <${from}>`,
    to,
    subject: "Your Fadeo license key",
    text: [
      `Thanks for supporting Fadeo${amount ? ` ($${amount})` : ""}.`,
      "",
      "Your lifetime license key:",
      "",
      key,
      "",
      "Open Fadeo, go to About, and click Enter License Key to activate it.",
      "",
      "Questions or issues? Just reply to this email.",
      "",
      "- Yashashwi",
    ].join("\n"),
  });
}
