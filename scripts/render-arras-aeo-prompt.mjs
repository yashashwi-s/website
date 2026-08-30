const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const reviewDate = args.get("--review-date");
const reviewMonth = args.get("--review-month");
const quarterly = args.get("--quarterly") === "true";

if (!reviewDate || !reviewMonth) {
  throw new Error("Usage: render-arras-aeo-prompt.mjs --review-date YYYY-MM-DD --review-month 'Month YYYY' --quarterly true|false");
}

const querySet = [
  "macOS desktop photo widget",
  "add photo widgets to MacBook desktop",
  "put a specific photo on a widget on Mac",
  "photo widget without cropping on Mac",
  "free open-source Mac desktop photo widget",
  "Arras Mac app",
  "Tableau photo widget Mac",
  "Photo Widget OSX",
];

const responseShape = {
  schemaVersion: 1,
  status: "ready",
  reviewedAt: reviewDate,
  page: "arras",
  summary: "One factual sentence summarizing what changed or stayed current.",
  queries: [
    {
      query: querySet[0],
      paaQuestions: ["Exact current People Also Ask question?"],
      notes: "What the current result showed, without guessing.",
    },
  ],
  faqs: [
    {
      question: "A natural-language question ending in a question mark?",
      answer: [
        "A direct, self-contained answer paragraph supported by the sources below.",
        "Optional second paragraph explaining how Arras differs or what the user should do.",
      ],
      sources: [
        {
          label: "Arras source and technical documentation",
          href: "https://github.com/yashashwi-s/Arras",
        },
      ],
    },
  ],
  evidence: [
    {
      claim: "A product or platform fact checked during the review.",
      sourceUrl: "https://github.com/yashashwi-s/Arras",
      checkedAt: reviewDate,
    },
  ],
};

const quarterlyInstruction = quarterly
  ? "This is a quarterly review. Also verify every existing source and download link, review any available Search Console or analytics evidence, and note unavailable data explicitly."
  : "This is a monthly review. Focus on current questions, changed product facts, and citation visibility.";

const prompt = `You are performing the ${reviewMonth} evidence review for Arras, a free native macOS desktop photo widget.

Browse and inspect these pages before answering:
- https://arras.yashashwi.me
- https://github.com/yashashwi-s/Arras
- https://github.com/yashashwi-s/Arras/releases/latest
- https://support.apple.com/guide/mac-help/mchl52be5da5/mac
- https://support.apple.com/102445

Search every query in this set and record the exact current Google People Also Ask questions you can actually observe:
${querySet.map((query) => `- ${query}`).join("\n")}

Test whether current ChatGPT, Claude, Perplexity, Gemini, and Google AI answers cite or accurately describe Arras when those interfaces are available to you. Never claim a citation you cannot see. ${quarterlyInstruction}

Create exactly 10 useful Arras FAQs. Prefer exact current People Also Ask wording for the highest-value questions. Preserve an existing FAQ when it remains accurate; change it only when current search evidence, the Arras repository, a release, or official Apple documentation warrants a change. Each answer must lead with a direct answer and may contain one to three short paragraphs. Every FAQ must include one to four authoritative sources placed outside the answer text.

Allowed answer-source domains are support.apple.com, developer.apple.com, github.com, and docs.github.com. Use the Arras repository for product facts and Apple documentation for macOS behavior. Do not use SEOengine.ai claims, keyword-density targets, fabricated statistics, invented testimonials, or unsupported performance claims.

Return one JSON object only—no Markdown fences and no commentary. It must follow this structure, except the faqs array must contain exactly 10 complete FAQ objects and queries should cover the full query set:
${JSON.stringify(responseShape, null, 2)}

If you cannot browse the current web, return {"schemaVersion":1,"status":"blocked","reviewedAt":"${reviewDate}","page":"arras","reason":"Current web access is unavailable"} instead of guessing.`;

const issueBody = `# Arras AEO review — ${reviewMonth}

This issue was created one day before the scheduled review and assigned to the repository owner, so normal GitHub notification settings can deliver it by email or in-app notification.

## Automatic path

The recurring Codex task is expected to perform the evidence review, submit the validated JSON here, monitor the apply workflow, and report the deployment without manual intervention. No action is required while that task remains available.

## Manual fallback

1. Copy the complete prompt below into any browsing-capable LLM such as ChatGPT, Claude, Gemini, or Perplexity.
2. Copy its JSON response.
3. Add a new comment to this issue. Put \`/submit-aeo-review\` on the first line and paste the JSON immediately below it.
4. GitHub Actions will accept submissions only from an owner, member, or collaborator. It will validate the response, update the Arras FAQs and review record, run the production build and AEO checks, commit to \`main\`, and close this issue. Invalid output leaves production unchanged and posts a failed-run link.

## Complete prompt

\`\`\`text
${prompt}
\`\`\`

## Submission shape

\`\`\`text
/submit-aeo-review
{paste the LLM JSON object here}
\`\`\`
`;

process.stdout.write(issueBody);
