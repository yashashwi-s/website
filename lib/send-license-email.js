import { Resend } from "resend";

export async function sendLicenseEmail({ to, key, amount }) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.LICENSE_EMAIL_FROM || "Fadeo <fadeo@yashashwi.me>";

  await resend.emails.send({
    from,
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
