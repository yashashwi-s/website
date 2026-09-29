import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  normalizeArrasProduct,
  serializeArrasProduct,
  validateArrasProduct,
} from "./lib/arras-product.mjs";

const MIRROR_PATH = resolve("data/arras-product.json");

function parseArguments(argv) {
  const options = { check: false, source: null };
  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--source") {
      const path = argv[index + 1];
      if (!path || path.startsWith("--")) throw new Error("--source requires a metadata file path");
      options.source = resolve(path);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}
async function readSource(path) {
  const source = await readFile(path, "utf8");
  let metadata;
  try {
    metadata = JSON.parse(source);
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
  return validateArrasProduct(normalizeArrasProduct(metadata));
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
if (!options.source) {
  throw new Error(
    "A reviewed Arras metadata source is required. Run node scripts/sync-arras-product.mjs --source ../app/product-metadata.json. " +
    "Do not apply released v2.4.9 metadata automatically: its published architecture fact is inaccurate."
  );
}
const metadata = await readSource(options.source);

const expected = serializeArrasProduct(metadata);
const current = await currentContents();
if (current === expected) {
  console.log(`Arras product metadata is synchronized with reviewed source ${options.source}.`);
} else if (options.check) {
  console.error(`data/arras-product.json differs from reviewed source ${options.source}.`);
  process.exitCode = 1;
} else {
  await writeFile(MIRROR_PATH, expected);
  console.log(`Updated data/arras-product.json from reviewed source ${options.source}.`);
}
