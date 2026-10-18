import faqData from "../app/puremac/arras-faqs.json" with { type: "json" };

// Stable page anchors live outside the evidence importer's question/answer schema.
const navigation = {
  "How do I add a single photo widget to my Mac desktop?": {
    "id": "exact-photo",
    "group": "getting-started"
  },
  "Which Macs can run the official download?": {
    "id": "compatibility",
    "group": "getting-started"
  },
  "Is Arras free and open source?": {
    "id": "free-open-source",
    "group": "getting-started"
  },
  "Can a Mac desktop photo widget show my whole photo without cropping?": {
    "id": "aspect-ratio",
    "group": "personalize"
  },
  "Can I build a collage and still move or resize each photo?": {
    "id": "collages",
    "group": "photo-workflows"
  },
  "Can I rotate multiple photos in one Space slideshow widget?": {
    "id": "photo-rotation",
    "group": "personalize"
  },
  "Can I keep a screenshot or PDF page floating above my work?": {
    "id": "reference-overlays",
    "group": "photo-workflows"
  },
  "Can I save and switch between different desktop setups?": {
    "id": "saved-setups",
    "group": "controls-and-limits"
  },
  "Does Arras collect usage statistics?": {
    "id": "telemetry",
    "group": "controls-and-limits"
  },
  "How do I install the notarized Arras download?": {
    "id": "gatekeeper",
    "group": "first-launch"
  }
};
export const arrasFaqs = faqData.map((faq, index) => ({
  ...(navigation[faq.question] || { id: `question-${index + 1}`, group: "controls-and-limits" }),
  ...faq,
}));
