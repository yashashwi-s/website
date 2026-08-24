import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const SUBMISSION_COMMAND = "/submit-aeo-review";
const ALLOWED_SOURCE_HOSTS = [
  "support.apple.com",
  "developer.apple.com",
  "github.com",
  "docs.github.com",
];
const REQUIRED_QUERIES = [
  "macOS desktop photo widget",
  "add photo widgets to MacBook desktop",
  "put a specific photo on a widget on Mac",
  "photo widget without cropping on Mac",
  "free open-source Mac desktop photo widget",
  "Arras Mac app",
  "Tableau photo widget Mac",
  "Photo Widget OSX",
];

function parseArguments(argv) {
  const args = new Map();
  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--validate-only") {
      args.set(argument, true);
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    args.set(argument, value);
    index += 1;
  }
  return args;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertText(value, field, minimum, maximum) {
  assert(typeof value === "string", `${field} must be a string`);
  const trimmed = value.trim();
  assert(trimmed.length >= minimum && trimmed.length <= maximum, `${field} must contain ${minimum}-${maximum} characters`);
  assert(!/<[^>]*>/.test(trimmed), `${field} must not contain HTML`);
  return trimmed;
}

function normalizeQuery(value) {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

function validateDate(value) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), "reviewedAt must use YYYY-MM-DD format");
  const reviewedAt = new Date(`${value}T00:00:00.000Z`);
  assert(!Number.isNaN(reviewedAt.valueOf()) && reviewedAt.toISOString().startsWith(value), "reviewedAt must be a real date");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const earliest = new Date(today);
  earliest.setUTCDate(earliest.getUTCDate() - 45);
  const latest = new Date(today);
  latest.setUTCDate(latest.getUTCDate() + 1);
  assert(reviewedAt >= earliest, "reviewedAt cannot be more than 45 days old");
  assert(reviewedAt <= latest, "reviewedAt cannot be more than one day in the future");
  return value;
}

function validateSource(source, field) {
  assert(isPlainObject(source), `${field} must be an object`);
  const label = assertText(source.label, `${field}.label`, 3, 160);
  const href = assertText(source.href, `${field}.href`, 12, 500);
  let url;
  try {
    url = new URL(href);
  } catch {
    throw new Error(`${field}.href must be a valid URL`);
  }
  assert(url.protocol === "https:", `${field}.href must use HTTPS`);
  assert(!url.username && !url.password, `${field}.href must not contain credentials`);
  const hostname = url.hostname.toLocaleLowerCase("en-US");
  assert(
    ALLOWED_SOURCE_HOSTS.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)),
    `${field}.href must use an approved Apple or GitHub documentation domain`
  );
  return { label, href: url.href };
}

function validateReview(rawReview) {
  assert(isPlainObject(rawReview), "The submission must be one JSON object");
  assert(rawReview.schemaVersion === 1, "schemaVersion must be 1");
  assert(rawReview.status === "ready", 'status must be "ready"; blocked reviews cannot be published');
  assert(rawReview.page === "arras", 'page must be "arras"');

  const reviewedAt = validateDate(rawReview.reviewedAt);
  const summary = assertText(rawReview.summary, "summary", 20, 500);

  assert(Array.isArray(rawReview.queries), "queries must be an array");
  assert(rawReview.queries.length >= REQUIRED_QUERIES.length && rawReview.queries.length <= 20, `queries must include all ${REQUIRED_QUERIES.length} required searches`);
  const queries = rawReview.queries.map((entry, index) => {
    const field = `queries[${index}]`;
    assert(isPlainObject(entry), `${field} must be an object`);
    const query = assertText(entry.query, `${field}.query`, 3, 160);
    assert(Array.isArray(entry.paaQuestions) && entry.paaQuestions.length <= 30, `${field}.paaQuestions must be an array with at most 30 items`);
    const paaQuestions = entry.paaQuestions.map((question, questionIndex) =>
      assertText(question, `${field}.paaQuestions[${questionIndex}]`, 5, 240)
    );
    const notes = assertText(entry.notes, `${field}.notes`, 5, 800);
    return { query, paaQuestions, notes };
  });
  const submittedQueries = new Set(queries.map(({ query }) => normalizeQuery(query)));
  for (const requiredQuery of REQUIRED_QUERIES) {
    assert(submittedQueries.has(normalizeQuery(requiredQuery)), `queries is missing required search: ${requiredQuery}`);
  }

  assert(Array.isArray(rawReview.faqs) && rawReview.faqs.length === 10, "faqs must contain exactly 10 items");
  const seenQuestions = new Set();
  const faqs = rawReview.faqs.map((faq, index) => {
    const field = `faqs[${index}]`;
    assert(isPlainObject(faq), `${field} must be an object`);
    const question = assertText(faq.question, `${field}.question`, 10, 160);
    assert(question.endsWith("?"), `${field}.question must end with a question mark`);
    const questionKey = question.toLocaleLowerCase("en-US");
    assert(!seenQuestions.has(questionKey), `${field}.question duplicates another FAQ`);
    seenQuestions.add(questionKey);

    assert(Array.isArray(faq.answer) && faq.answer.length >= 1 && faq.answer.length <= 3, `${field}.answer must contain 1-3 paragraphs`);
    const answer = faq.answer.map((paragraph, paragraphIndex) =>
      assertText(paragraph, `${field}.answer[${paragraphIndex}]`, 40, 900)
    );

    assert(Array.isArray(faq.sources) && faq.sources.length >= 1 && faq.sources.length <= 4, `${field}.sources must contain 1-4 sources`);
    const sources = faq.sources.map((source, sourceIndex) => validateSource(source, `${field}.sources[${sourceIndex}]`));
    return { question, answer, sources };
  });

  const evidenceInput = rawReview.evidence ?? [];
  assert(Array.isArray(evidenceInput) && evidenceInput.length <= 50, "evidence must be an array with at most 50 items");
  const evidence = evidenceInput.map((entry, index) => {
    const field = `evidence[${index}]`;
    assert(isPlainObject(entry), `${field} must be an object`);
    const claim = assertText(entry.claim, `${field}.claim`, 10, 500);
    const source = validateSource({ label: "Evidence source", href: entry.sourceUrl }, field);
    const checkedAt = validateDate(entry.checkedAt);
    return { claim, sourceUrl: source.href, checkedAt };
  });

  return {
    schemaVersion: 1,
    status: "ready",
    reviewedAt,
    page: "arras",
    summary,
    queries,
    faqs,
    evidence,
  };
}

function extractJson(comment) {
  const trimmedComment = comment.trim();
  assert(trimmedComment.startsWith(SUBMISSION_COMMAND), `The comment must begin with ${SUBMISSION_COMMAND}`);
  assert(
    trimmedComment.length === SUBMISSION_COMMAND.length || /\s/.test(trimmedComment[SUBMISSION_COMMAND.length]),
    `The command must be exactly ${SUBMISSION_COMMAND}`
  );

  let payload = trimmedComment.slice(SUBMISSION_COMMAND.length).trim();
  if (/^```(?:json)?\s*/i.test(payload)) {
    payload = payload.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  assert(payload.startsWith("{") && payload.endsWith("}"), "The command must be followed by one JSON object");
  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new Error(`The submitted JSON is invalid: ${error.message}`);
  }
}

function replaceDateConstant(path, constantName, reviewedAt) {
  const source = readFileSync(path, "utf8");
  const pattern = new RegExp(`const ${constantName} = "\\d{4}-\\d{2}-\\d{2}";`);
  assert(pattern.test(source), `Could not find ${constantName} in ${path}`);
  writeFileSync(path, source.replace(pattern, `const ${constantName} = "${reviewedAt}";`));
}

const args = parseArguments(process.argv);
const inputPath = args.get("--input");
assert(inputPath, "Usage: import-arras-aeo-review.mjs --input COMMENT_FILE [--validate-only] [--github-output FILE]");

const comment = inputPath === "-" ? readFileSync(0, "utf8") : readFileSync(inputPath, "utf8");
const review = validateReview(extractJson(comment));
const repositoryRoot = resolve(args.get("--root") || process.cwd());
const archivePath = join("data", "arras-aeo-reviews", `${review.reviewedAt.slice(0, 7)}.json`);

if (!args.get("--validate-only")) {
  const absoluteArchivePath = join(repositoryRoot, archivePath);
  mkdirSync(dirname(absoluteArchivePath), { recursive: true });
  writeFileSync(join(repositoryRoot, "app", "puremac", "arras-faqs.json"), `${JSON.stringify(review.faqs, null, 2)}\n`);
  writeFileSync(absoluteArchivePath, `${JSON.stringify(review, null, 2)}\n`);
  replaceDateConstant(join(repositoryRoot, "app", "puremac", "arras", "page.jsx"), "CONTENT_UPDATED_AT", review.reviewedAt);
  replaceDateConstant(join(repositoryRoot, "app", "puremac", "sitemap.js"), "LAST_UPDATED", review.reviewedAt);
}

const outputs = {
  reviewed_at: review.reviewedAt,
  archive_path: relative(repositoryRoot, join(repositoryRoot, archivePath)),
};
const githubOutput = args.get("--github-output");
if (githubOutput) {
  appendFileSync(githubOutput, Object.entries(outputs).map(([key, value]) => `${key}=${value}`).join("\n") + "\n");
}

console.log(`Validated Arras AEO review dated ${review.reviewedAt}${args.get("--validate-only") ? "" : " and updated repository data"}.`);
