// One explanation for visible installation, FAQ/schema answers, and llms.txt.
// Distribution facts come from the validated canonical product metadata.
export const arrasVerificationMessage = "Apple is not able to verify that it is free from malware";

export function getArrasInstallation(product) {
  const explanation = product.publicRelease.notarized
    ? "The current Arras build is notarized by Apple. macOS may ask you to confirm opening an app downloaded from the internet."
    : "The current Arras build is not notarized by Apple, so macOS may show its standard Gatekeeper verification message on first launch.";
  const verification = product.publicRelease.notarized
    ? explanation
    : `${explanation} The message “${arrasVerificationMessage}” is expected for this distribution: it means Apple cannot verify the build, rather than reporting that malware was detected.`;
  const approval = "After trying to open Arras, open System Settings → Privacy & Security → Open Anyway. Confirm with your Mac password or Touch ID if requested, then choose Open. This is macOS confirming your decision to open Arras; the password is not shared with the app. After approval, Arras opens normally.";
  const steps = [
    { name: "Download Arras", text: "Download the Arras DMG using this website’s button or the official yashashwi-s/Arras GitHub Release." },
    { name: "Move Arras to Applications", text: "Open the DMG and drag Arras into Applications." },
    { name: "Open Arras", text: "Open Arras from Applications. Its controls live in your menu bar." },
    { name: "Confirm the first launch", text: product.publicRelease.notarized ? explanation : `${explanation} Choose System Settings → Privacy & Security → Open Anyway, confirm with your password or Touch ID if requested, then choose Open.` },
  ];
  const trust = `Arras is free and open source, its official releases are published on GitHub, and photos stay locally on your Mac.${product.telemetry ? "" : " The app has no analytics or telemetry."}`;
  return {
    explanation,
    verification,
    approval,
    steps,
    trust,
    faqAnswer: [verification, product.publicRelease.notarized ? steps[2].text : `For the download from this website or the official yashashwi-s/Arras GitHub Release, move Arras to Applications and try opening it. ${approval}`, trust],
  };
}
