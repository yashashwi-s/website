import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  readAndValidateArrasProduct,
  serializeArrasProduct,
  validateArrasProduct,
} from "./lib/arras-product.mjs";

const API_URL = "https://api.github.com/repos/yashashwi-s/Arras/releases/latest";
const MIRROR_PATH = resolve("data/arras-product.json");

function parseArguments(argv) {
  const options = { check: false, bootstrap: null };
  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--bootstrap") {
      const path = argv[index + 1];
      if (!path || path.startsWith("--")) throw new Error("--bootstrap requires a metadata file path");
      options.bootstrap = resolve(path);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (options.check && options.bootstrap) throw new Error("--check and --bootstrap cannot be combined");
  return options;
}

function headers() {
  const result = {
    Accept: "application/vnd.github+json",
    "User-Agent": "website-arras-product-sync",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return result;
}

async function fetchLatestRelease() {
  const response = await fetch(API_URL, { headers: headers() });
  if (!response.ok) throw new Error(`GitHub latest-release request failed: ${response.status} ${response.statusText}`);
  const release = await response.json();
  if (release.draft || release.prerelease) throw new Error("GitHub latest release must be stable and published");
  if (!/^v\d+\.\d+\.\d+$/.test(release.tag_name ?? "")) {
    throw new Error(`Latest stable release tag is malformed: ${release.tag_name ?? "missing"}`);
  }
  return release;
}

async function fetchTaggedMetadata(tag) {
  const url = `https://raw.githubusercontent.com/yashashwi-s/Arras/${encodeURIComponent(tag)}/product-metadata.json`;
  const response = await fetch(url, { headers: { "User-Agent": "website-arras-product-sync" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Tagged product metadata request failed: ${response.status} ${response.statusText}`);
  let metadata;
  try {
    metadata = await response.json();
  } catch (error) {
    throw new Error(`Tagged product metadata is not valid JSON: ${error.message}`);
  }
  return validateArrasProduct(metadata);
}

async function currentContents() {
  try {
    return await readFile(MIRROR_PATH, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

const options = parseArguments(process.argv);
const release = await fetchLatestRelease();
let metadata = await fetchTaggedMetadata(release.tag_name);
let usedBootstrap = false;

if (!metadata) {
  if (!options.bootstrap) {
    throw new Error(
      `Arras ${release.tag_name} does not contain product-metadata.json. ` +
      "The local audited bootstrap remains unchanged; release the canonical contract before enabling tagged synchronization."
    );
  }
  metadata = await readAndValidateArrasProduct(options.bootstrap);
  usedBootstrap = true;
  console.warn(`Using explicitly supplied audited bootstrap because ${release.tag_name} predates the released product contract.`);
}

const expected = serializeArrasProduct(metadata);
const current = await currentContents();
if (current === expected) {
  console.log(`Arras product metadata is synchronized (${release.tag_name}${usedBootstrap ? ", audited bootstrap" : ""}).`);
} else if (options.check) {
  console.error(`data/arras-product.json differs from released Arras metadata at ${release.tag_name}.`);
  process.exitCode = 1;
} else {
  await writeFile(MIRROR_PATH, expected);
  console.log(`Updated data/arras-product.json (${release.tag_name}${usedBootstrap ? ", audited bootstrap" : ""}).`);
}
