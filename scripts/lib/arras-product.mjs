import { readFile } from "node:fs/promises";
export { serializeArrasProduct, validateArrasProduct } from "../../lib/arras-product-schema.mjs";
import { validateArrasProduct } from "../../lib/arras-product-schema.mjs";

export async function readAndValidateArrasProduct(path) {
  const source = await readFile(path, "utf8");
  let metadata;
  try {
    metadata = JSON.parse(source);
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
  return validateArrasProduct(metadata);
}
