import fs from "fs";
import path from "path";

// ============================================================
// LaTeX → Structured Data Parser
// ============================================================
// Reads data/resume.tex at BUILD TIME and converts it into
// structured JSON that the CV page renders.
//
// Workflow:
//   1. You paste your LaTeX into data/resume.tex
//   2. git push
//   3. Vercel builds → this parser runs → cv.yashashwi.me updates
// ============================================================

export function parseResume() {
  const texPath = path.join(process.cwd(), "data", "resume.tex");
  const raw = fs.readFileSync(texPath, "utf-8");
  return parseTex(raw);
}

// ── Core Parser ───────────────────────────────────────────

function parseTex(raw) {
  // Strip lines that start with %
  const cleaned = raw
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("%"))
    .join("\n");

  const header = parseHeader(cleaned);
  const sections = parseSections(cleaned);

  return { ...header, sections };
}

// ── Header Parser ─────────────────────────────────────────

function parseHeader(tex) {
  const centerMatch = tex.match(
    /\\begin\{center\}([\s\S]*?)\\end\{center\}/
  );
  if (!centerMatch) return { name: "", phone: "", email: "", links: [] };

  const block = centerMatch[1];

  // Name: inside \textbf{\Huge \scshape NAME}
  let name = "";
  const tbfIdx = block.indexOf("\\textbf{");
  if (tbfIdx !== -1) {
    const { arg } = extractBraceArg(block, tbfIdx + 7);
    name = arg
      .replace(/\\Huge/g, "")
      .replace(/\\scshape/g, "")
      .trim();
  }

  // Phone: first digit sequence that looks like a phone number
  const phoneMatch = block.match(/(\+?\d[\d\s-]{7,})/);
  const phone = phoneMatch ? phoneMatch[1].trim() : "";

  // Email: from \href{mailto:EMAIL}
  const emailMatch = block.match(/\\href\{mailto:([^}]+)\}/);
  const email = emailMatch ? emailMatch[1].trim() : "";

  // Links: all \href{https://...}{...} (non-mailto)
  const links = [];
  const linkRegex = /\\href\{(https?:\/\/[^}]+)\}/g;
  let m;
  while ((m = linkRegex.exec(block)) !== null) {
    const url = m[1];
    const { arg } = extractBraceArg(block, m.index + m[0].length);
    const label = stripFormatting(arg);
    links.push({ label, url });
  }

  return { name, phone, email, links };
}

// ── Section Parser ────────────────────────────────────────

function parseSections(tex) {
  const sections = [];
  const regex =
    /\\section\{([^}]+)\}([\s\S]*?)(?=\\section\{|\\end\{document\}|$)/g;
  let m;

  while ((m = regex.exec(tex)) !== null) {
    const title = m[1].trim();
    const body = m[2];
    sections.push(classifyAndParse(title, body));
  }

  return sections;
}

function classifyAndParse(title, body) {
  if (body.includes("\\resumeProjectHeading")) {
    return { title, type: "projects", entries: parseProjects(body) };
  }
  if (body.includes("\\resumeSubheading")) {
    return {
      title,
      type: "subheadings",
      entries: parseSubheadings(body),
    };
  }
  if (/\\textbf\{[^}]+\}\{:/.test(body)) {
    return { title, type: "skills", entries: parseSkills(body) };
  }
  if (body.includes("\\resumeItem")) {
    return { title, type: "items", entries: parseItems(body) };
  }
  return { title, type: "raw", content: cleanText(body) };
}

// ── Subheading Entries (Education, Experience, Campus) ─────

function parseSubheadings(body) {
  const entries = [];
  const cmd = "\\resumeSubheading";
  let pos = 0;

  while (true) {
    const idx = body.indexOf(cmd, pos);
    if (idx === -1) break;

    const { args, endPos } = extractNArgs(body, idx + cmd.length, 4);

    // Find bullets between this subheading and the next one
    const nextIdx = body.indexOf(cmd, endPos);
    const region = body.slice(
      endPos,
      nextIdx !== -1 ? nextIdx : body.length
    );
    const bullets = extractResumeItems(region).map(cleanText);

    entries.push({
      line1Left: cleanText(args[0]),
      line1Right: cleanText(args[1]),
      line2Left: cleanText(args[2]),
      line2Right: cleanText(args[3]),
      bullets,
    });

    pos = endPos;
  }

  return entries;
}

// ── Project Entries ───────────────────────────────────────

function parseProjects(body) {
  const entries = [];
  const cmd = "\\resumeProjectHeading";
  let pos = 0;

  while (true) {
    const idx = body.indexOf(cmd, pos);
    if (idx === -1) break;

    const { args, endPos } = extractNArgs(body, idx + cmd.length, 3);

    const nextIdx = body.indexOf(cmd, endPos);
    const region = body.slice(
      endPos,
      nextIdx !== -1 ? nextIdx : body.length
    );
    const bullets = extractResumeItems(region).map(cleanText);

    entries.push({
      name: cleanText(args[0]),
      tech: cleanText(args[1]),
      date: cleanText(args[2]),
      bullets,
    });

    pos = endPos;
  }

  return entries;
}

// ── Item Entries (Achievements) ───────────────────────────

function parseItems(body) {
  return extractResumeItems(body).map(cleanText);
}

// ── Skills Entries ────────────────────────────────────────

function parseSkills(body) {
  const skills = [];
  const regex = /\\textbf\{([^}]+)\}\{:\s*([^}]+)\}/g;
  let m;
  while ((m = regex.exec(body)) !== null) {
    skills.push({
      category: m[1].trim(),
      items: cleanText(m[2].trim()),
    });
  }
  return skills;
}

// ── Extract \resumeItem{...} with brace matching ─────────

function extractResumeItems(text) {
  const items = [];
  const cmd = "\\resumeItem";
  let pos = 0;

  while (true) {
    const idx = text.indexOf(cmd, pos);
    if (idx === -1) break;
    const { arg, endPos } = extractBraceArg(text, idx + cmd.length);
    items.push(arg);
    pos = endPos;
  }

  return items;
}

// ── Brace-Matching Utilities ──────────────────────────────

function extractBraceArg(str, startPos) {
  let pos = startPos;
  while (pos < str.length && str[pos] !== "{") pos++;
  if (pos >= str.length) return { arg: "", endPos: pos };

  let depth = 0;
  const start = pos + 1;
  for (let i = pos; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) return { arg: str.slice(start, i), endPos: i + 1 };
    }
  }
  return { arg: str.slice(start), endPos: str.length };
}

function extractNArgs(str, startPos, n) {
  const args = [];
  let pos = startPos;
  for (let i = 0; i < n; i++) {
    const { arg, endPos } = extractBraceArg(str, pos);
    args.push(arg);
    pos = endPos;
  }
  return { args, endPos: pos };
}

// ── LaTeX → Clean Text ───────────────────────────────────

function cleanText(raw) {
  let s = raw;

  // 1. Process \href using brace matching (handles all nesting)
  s = processHrefs(s);

  // 2. Process \textbf → **bold**
  s = processCmd(s, "\\textbf", (c) => `**${c}**`);

  // 3. Strip formatting commands (keep content)
  s = processCmd(s, "\\textit", (c) => c);
  s = processCmd(s, "\\texttt", (c) => c);
  s = processCmd(s, "\\underline", (c) => c);
  s = processCmd(s, "\\emph", (c) => c);

  // 4. \textcolor{color}{text} → text
  s = processTwoArgCmd(s, "\\textcolor");

  // 5. Math mode
  s = s.replace(/\$\\text\{([^}]+)\}\$/g, "$1");
  s = s.replace(/\$\\mathcal\{([^}]+)\}([^$]*)\$/g, (_, l, r) => {
    return l + r.replace(/\\delta/g, "δ").replace(/\\mu/g, "μ");
  });
  // Generic $...$ → strip dollars, convert known symbols
  s = s.replace(/\$([^$]+)\$/g, (_, inner) => {
    return inner
      .replace(/\\delta/g, "δ")
      .replace(/\\mu/g, "μ")
      .replace(/\\times/g, "×")
      .replace(/\\text\{([^}]+)\}/g, "$1");
  });

  // 6. Simple substitutions
  s = s.replace(/\\textbar\{?\}?/g, "|");
  s = s.replace(/\\hspace\{[^}]*\}/g, "");
  s = s.replace(/\\vspace\{[^}]*\}/g, "");
  s = s.replace(/\\LaTeX/g, "LaTeX");
  s = s.replace(/\\TeX/g, "TeX");
  s = s.replace(
    /\\(small|scshape|Huge|large|Large|normalsize|footnotesize|noindent)/g,
    ""
  );
  s = s.replace(/\\\\/g, " ");
  s = s.replace(/~/g, " ");
  s = s.replace(/\\%/g, "%");
  s = s.replace(/\\&/g, "&");
  s = s.replace(/\\_/g, "_");
  s = s.replace(/\\#/g, "#");
  s = s.replace(/``/g, "\u201C"); // opening smart quote
  s = s.replace(/''/g, "\u201D"); // closing smart quote
  s = s.replace(/`/g, "\u2018");
  s = s.replace(/'/g, "\u2019");
  s = s.replace(/---/g, "\u2014"); // em dash
  s = s.replace(/--/g, "\u2013"); // en dash

  // 7. Cleanup
  s = s.replace(/\s+/g, " ").trim();

  return s;
}

// ── Process \href with proper brace matching ──────────────

function processHrefs(text) {
  let result = text;
  let from = 0;

  while (true) {
    const idx = result.indexOf("\\href{", from);
    if (idx === -1) break;

    const urlArg = extractBraceArg(result, idx + 5);
    const contentArg = extractBraceArg(result, urlArg.endPos);

    const label = stripFormatting(contentArg.arg);
    const url = urlArg.arg.trim();
    const replacement = `[${label}](${url})`;

    result =
      result.slice(0, idx) + replacement + result.slice(contentArg.endPos);
    from = idx + replacement.length;
  }

  return result;
}

// ── Process single-arg command: \cmd{content} → transform(content) ──

function processCmd(text, cmd, transform) {
  let result = text;
  let from = 0;

  while (true) {
    const idx = result.indexOf(cmd, from);
    if (idx === -1) break;

    // Ensure next non-whitespace char is '{'
    let pos = idx + cmd.length;
    while (pos < result.length && /\s/.test(result[pos])) pos++;
    if (pos >= result.length || result[pos] !== "{") {
      from = pos;
      continue;
    }

    const { arg, endPos } = extractBraceArg(result, pos);
    const replacement = transform(arg);
    result = result.slice(0, idx) + replacement + result.slice(endPos);
    from = idx + replacement.length;
  }

  return result;
}

// ── Process two-arg command: \cmd{ignored}{content} → content ──

function processTwoArgCmd(text, cmd) {
  let result = text;
  let from = 0;

  while (true) {
    const idx = result.indexOf(cmd, from);
    if (idx === -1) break;

    const firstArg = extractBraceArg(result, idx + cmd.length);
    const secondArg = extractBraceArg(result, firstArg.endPos);

    result =
      result.slice(0, idx) + secondArg.arg + result.slice(secondArg.endPos);
    from = idx + secondArg.arg.length;
  }

  return result;
}

// ── Strip all formatting from a string (for link labels) ──

function stripFormatting(text) {
  let s = text;
  s = s.replace(/\\textcolor\{[^}]*\}/g, "");
  s = s.replace(/\\underline/g, "");
  s = s.replace(/\\textbf/g, "");
  s = s.replace(/\\textit/g, "");
  s = s.replace(/\\texttt/g, "");
  s = s.replace(/\\emph/g, "");
  // Remove single-level brace groups: {content} → content
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\{([^{}]*)\}/g, "$1");
  }
  return s.trim();
}
