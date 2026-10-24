import { getArrasAppStoreOffer } from "./arras-installation.mjs";

export const ARRAS_SUPPORT_EMAIL = "yashashwisinghania@gmail.com";
export const ARRAS_SUPPORT_MAILTO = `mailto:${ARRAS_SUPPORT_EMAIL}?subject=Arras%20support`;

export function getArrasStoreFaqs(product) {
  const offer = getArrasAppStoreOffer(product);
  if (!offer) return [];
  const sources = [{ label: "Arras Widgets on the Mac App Store", href: offer.url }];
  return [
    {
      id: "app-store-availability",
      question: "Is Arras Widgets available on the Mac App Store?",
      answer: [`Yes. Arras Widgets is the Mac App Store edition of Arras, priced at ${offer.price} in the United States. Local prices may vary. It requires macOS ${product.minimumMacOS} or later and supports Apple Silicon and Intel Macs. The free, open-source direct download remains available.`],
      sources,
    },
    {
      id: "app-store-edition",
      question: "How is Arras Widgets different from the free download?",
      answer: ["Both editions put photo widgets, editable collages and slideshows on your Mac desktop. The Mac App Store edition is a separate paid purchase, is sandboxed, receives updates through Apple, and does not send Arras usage statistics. The free direct download receives updates from GitHub and sends the limited statistics described in Security & Privacy. Photos and layouts stay on your Mac in both editions."],
      sources: [...sources, { label: "Edition privacy and storage", href: product.documentation.securityUrl }],
    },
    {
      id: "app-store-library",
      question: "Can I bring my existing Arras library to the App Store edition?",
      answer: ["Yes. The App Store edition has a separate library in its app container. In Preferences, explicitly select your existing library folder to import it. Importing leaves the original library unchanged. Export an .arras backup before switching editions, and keep your original photos."],
      sources: [{ label: "Arras library storage and backups", href: `${product.documentation.securityUrl}#local-data` }],
    },
    {
      id: "support-development",
      question: "Why buy Arras Widgets if the direct download is free?",
      answer: ["Buying Arras Widgets supports independent development of Arras. It is a one-time purchase, with installation and updates managed by Apple. This edition is sandboxed and sends no Arras usage statistics. With Family Sharing enabled, up to six family members can use it.", "The core photo widgets, editable collages, slideshows and saved setups are also available in the free, open-source direct download. Choose the Store edition for its purchase and update experience and to support the maker; you do not need to buy it to keep using the free edition."],
      sources: [...sources, { label: "Apple Family Sharing", href: "https://support.apple.com/guide/mac-help/share-purchases-family-sharing-group-mchlc2b37692/mac" }],
    },
  ];
}
