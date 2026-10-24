import Image from "next/image";
import { arrasCanonicalUrl, arrasProduct, arrasFeatureContractUrl } from "@/data/arras-product";
import { getArrasLinks } from "../arras-links";
import SupportPage, { supportMetadata } from "../support-page";

const SLUG = "mac-desktop-customization";
const TITLE = "Mac Desktop Customization with Photos & Widgets | Arras";
const DESCRIPTION = "Build an aesthetic Mac desktop with wallpaper, photo widgets, editable collages and slideshows. A visual setup guide with real Arras screenshots.";
const REVIEWED = "2026-10-24";
const APPLE_WIDGETS = "https://support.apple.com/guide/mac-help/add-and-customize-widgets-mchl52be5da5/mac";
const APPLE_WALLPAPER = "https://support.apple.com/guide/mac-help/choose-your-desktop-picture-mchlp3013/mac";

export const metadata = supportMetadata(SLUG, TITLE, DESCRIPTION);

function DesktopExample({ name, alt, children }) {
  const src = `/puremac/arras/features/${name}.webp`;
  return <figure className="ar-guide-shot">
    <a href={src} aria-label={`Enlarge desktop example: ${alt}`}>
      <Image src={src} alt={alt} width={1470} height={956} sizes="(max-width: 800px) calc(100vw - 40px), 840px" />
    </a>
    <figcaption>{children}</figcaption>
  </figure>;
}

export default async function DesktopCustomizationPage() {
  const links = await getArrasLinks();
  const url = `${arrasCanonicalUrl}/${SLUG}`;
  const featureUrl = arrasFeatureContractUrl();
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@id": `${url}#page` },
    headline: "Customize your Mac desktop with photos and widgets",
    description: DESCRIPTION,
    datePublished: REVIEWED,
    dateModified: REVIEWED,
    author: { "@type": "Person", "@id": "https://yashashwi.me/#person", name: arrasProduct.publisher.name, url: arrasProduct.publisher.url },
    publisher: { "@id": "https://yashashwi.me/#person" },
    image: ["collages", "appearance", "slideshow-layers"].map(name => `${arrasCanonicalUrl}/puremac/arras/features/${name}.webp`),
    citation: [APPLE_WIDGETS, APPLE_WALLPAPER, featureUrl],
    isAccessibleForFree: true,
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }} />
    <SupportPage links={links} active={SLUG} label="Desktop customization guide"
      title={<>Customize your Mac desktop<br /><em>with photos and widgets.</em></>}
      intro="Build an aesthetic Mac setup around a wallpaper, useful widgets and photos that belong together. This guide shows real desktop arrangements made with Arras."
      sections={[["choose-widgets", "Choose your widgets"], ["wallpaper", "Start with a palette"], ["collage", "Arrange the photos"], ["appearance", "Make the styles match"], ["layers", "Keep it useful"], ["save-setup", "Save your setup"], ["get-started", "Get started"]]}>
      <p className="ar-fine">By <a href={arrasProduct.publisher.url}>{arrasProduct.publisher.name}</a>, maker of Arras · Reviewed <time dateTime={REVIEWED}>24 October 2026</time> · Arras {arrasProduct.publicRelease.version}</p>
      <DesktopExample name="collages" alt="Three framed photos in a paper collage beside a transparent photo group, with captions on a real Mac desktop.">A shared background makes a small collection feel intentional. Paper and transparent groups create different kinds of separation.</DesktopExample>
      <section id="choose-widgets">
        <h2>Which widget apps should you use?</h2>
        <p>Choose widgets for what you want to see: a calendar for the day ahead, weather for the next outing, and a few photos that make the space your own. Arras handles the photo part: freely placed photo widgets, editable collages and slideshows. Use it alongside the widgets already on your Mac.</p>
        <div className="ar-guide-table" role="region" aria-label="Desktop customization choices" tabIndex={0}>
          <table><thead><tr><th scope="col">What you want</th><th scope="col">Where to start</th></tr></thead><tbody>
            <tr><th scope="row">A background for the whole desktop</th><td>Wallpaper in macOS System Settings</td></tr>
            <tr><th scope="row">Calendar, weather and other information</th><td>The macOS widget gallery and apps that provide those widgets</td></tr>
            <tr><th scope="row">Photos you can place, frame and group yourself</th><td>Arras photo widgets and editable collages</td></tr>
          </tbody></table>
        </div>
        <p>To add a macOS widget, Control-click the desktop, choose Edit Widgets, then click or drag a widget from the gallery. <a href={APPLE_WIDGETS}>Apple explains the available widget controls.</a></p>
        <p>Arras uses its own desktop photo windows. Add your photos through Arras in the menu bar; they do not appear as an Arras item in Apple's widget gallery.</p>
      </section>
      <section id="wallpaper">
        <h2>Start with a wallpaper and a small palette.</h2>
        <p>Pick the wallpaper first, then choose two or three photos that share a color with it. Warm stone, paper and greenery work together in the examples below. Keep a quiet area for your app windows and leave the Dock and any frequently used desktop files easy to reach.</p>
        <p>Change your background in System Settings → Wallpaper. You can use an Apple wallpaper or your own image. <a href={APPLE_WALLPAPER}>Apple's wallpaper guide</a> covers both.</p>
      </section>
      <section id="collage">
        <h2>Give the photos a place to belong.</h2>
        <p>In Arras, choose Add → Create Collage, or start with Add → Try an Example. A collage gives a group of pictures one background while each photo remains independently movable and resizable.</p>
        <p>Start with one larger image and two smaller companions. Align their edges and repeat the gap between them. Drag the collage background to move the arrangement; resize a member from a corner to change its emphasis. The boundary grows and shrinks as its photos change.</p>
        <p>Use a caption for a place, a date or a short phrase. Place it in a clear part of the composition so it remains readable. Lock the arrangement once its placement feels right.</p>
      </section>
      <section id="appearance">
        <h2>Repeat one style, then vary the shapes.</h2>
        <p>Choose a frame, mat and shadow that suit the wallpaper. Polaroid and Gallery are starting points; Copy Appearance carries a style to another photo while keeping its image and position. Repeating those details lets a tall portrait and a wide landscape belong in the same setup.</p>
        <DesktopExample name="appearance" alt="Individually styled rounded, elliptical and arched Arras photos, with collage captions arranged around them on a Mac desktop.">Different silhouettes can still share a palette. Leave enough space around each photo to make the shape visible.</DesktopExample>
        <p>Keep the ordinary photo sizing when you want to preserve the whole image. Transparent PNGs can add a cutout or a small graphic. A deliberate tilt or unusual shape works best where it has room.</p>
      </section>
      <section id="layers">
        <h2>Choose what stays visible while you work.</h2>
        <p>Arras has four depth settings: Behind Icons, On Desktop, Above Widgets and Floating. Use Above Widgets when a photo should sit over the system widgets. Use Floating for a visual reference you need above app windows. A collage's depth applies to its whole group.</p>
        <DesktopExample name="slideshow-layers" alt="An Arras slideshow and a separate photo with Floating depth selected in Settings, on a warm sand-dune Mac desktop.">A rotating collection and a steady reference can share the same desktop. Give them different jobs and different depths.</DesktopExample>
        <p>For changing photos, use a Space slideshow and choose its order and interval in Edit Slideshow. Dynamic sizing keeps each photo's proportions; Fixed sizing fills one frame and can crop. A Photos album or Finder folder can supply the collection.</p>
        <p>Before showing your screen to others, review <a href={links.security}>Privacy's screen-sharing controls and their limits</a>. Some recording apps can capture visible widgets, and browser meetings are not automatically detected.</p>
      </section>
      <section id="save-setup">
        <h2>Save the setup before changing it.</h2>
        <p>Save your arrangement in Setups, then experiment with another palette or layout. Named setups let you keep a work reference, a personal photo wall and a quieter desktop ready to switch between. Export a .arras backup when you want a portable copy with its stored media.</p>
        <p>A useful final check: can you read the calendar, reach the files you use and open an app without rearranging the whole desktop? Keep the parts you enjoy and adjust anything that gets in your way.</p>
      </section>
      <section id="get-started">
        <h2>Make your own desktop.</h2>
        <p>Arras runs on macOS {arrasProduct.minimumMacOS} or later, on Intel and Apple Silicon Macs. The free, open-source direct download and the paid Arras Widgets edition on the Mac App Store both include photo widgets, editable collages, slideshows and saved setups.</p>
        <p><a className="ar-button" href={`${links.home}#install`}>Get Arras <span aria-hidden="true">↗</span></a></p>
        <p><a href={links.faqs}>Setup instructions and questions</a> · <a href={links.support}>Edition differences and support</a></p>
        <p className="ar-fine">Steps checked against <a href={featureUrl} referrerPolicy="origin">the published Arras feature documentation</a>. Screenshots show the app running on a Mac with sample artwork. This guide is written by Arras's maker.</p>
      </section>
    </SupportPage>
  </>;
}
