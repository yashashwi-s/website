import { readFile } from "node:fs/promises";

const EXPECTED_REPOSITORY = "https://github.com/yashashwi-s/Arras";
const EXPECTED_TAP = "yashashwi-s/tap";
const EXPECTED_CASK = "arras";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertObject(value, field) {
  assert(value && typeof value === "object" && !Array.isArray(value), `${field} must be an object`);
}

function assertText(value, field) {
  assert(typeof value === "string" && value.trim() === value && value.length > 0, `${field} must be a non-empty string`);
}

function assertHttps(value, field) {
  assertText(value, field);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${field} must be a valid URL`);
  }
  assert(parsed.protocol === "https:", `${field} must use HTTPS`);
  assert(!parsed.username && !parsed.password, `${field} must not contain credentials`);
}

export function validateArrasProduct(metadata) {
  assertObject(metadata, "product metadata");
  assert(metadata.schemaVersion === 1, "schemaVersion must be 1");
  for (const field of [
    "name",
    "category",
    "shortDescription",
    "repositoryDescription",
    "bundleIdentifier",
    "minimumMacOS",
    "featureContractPath",
  ]) {
    assertText(metadata[field], field);
  }
  assert(metadata.name === "Arras", 'name must be "Arras"');
  assertHttps(metadata.canonicalUrl, "canonicalUrl");
  assertHttps(metadata.repositoryUrl, "repositoryUrl");
  assert(metadata.repositoryUrl === EXPECTED_REPOSITORY, `repositoryUrl must be ${EXPECTED_REPOSITORY}`);
  assert(/^\d+\.\d+$/.test(metadata.minimumMacOS), "minimumMacOS must use major.minor form");
  assert(!metadata.featureContractPath.startsWith("/") && !metadata.featureContractPath.includes(".."), "featureContractPath must be repository-relative");

  assertObject(metadata.publisher, "publisher");
  assertText(metadata.publisher.name, "publisher.name");
  assertHttps(metadata.publisher.url, "publisher.url");
  assert(Array.isArray(metadata.historicalNames), "historicalNames must be an array");
  metadata.historicalNames.forEach((name, index) => assertText(name, `historicalNames[${index}]`));

  assertObject(metadata.publicRelease, "publicRelease");
  assert(Array.isArray(metadata.publicRelease.architectures) && metadata.publicRelease.architectures.length > 0, "publicRelease.architectures must be a non-empty array");
  metadata.publicRelease.architectures.forEach((architecture, index) => assertText(architecture, `publicRelease.architectures[${index}]`));
  assert(typeof metadata.publicRelease.notarized === "boolean", "publicRelease.notarized must be boolean");
  assertObject(metadata.sourceBuild, "sourceBuild");
  assert(typeof metadata.sourceBuild.intelSupported === "boolean", "sourceBuild.intelSupported must be boolean");
  assert(typeof metadata.telemetry === "boolean", "telemetry must be boolean");

  assertObject(metadata.license, "license");
  assert(metadata.license.spdx === "MIT", 'license.spdx must be "MIT"');
  assertHttps(metadata.license.url, "license.url");

  assertObject(metadata.homebrew, "homebrew");
  assert(metadata.homebrew.tap === EXPECTED_TAP, `homebrew.tap must be ${EXPECTED_TAP}`);
  assert(metadata.homebrew.cask === EXPECTED_CASK, `homebrew.cask must be ${EXPECTED_CASK}`);
  assert(metadata.homebrew.trustScope === "tap", 'homebrew.trustScope must be "tap"');
  assertHttps(metadata.homebrew.tapRepository, "homebrew.tapRepository");
  const expectedCommands = [
    `brew tap ${metadata.homebrew.tap}`,
    `brew trust ${metadata.homebrew.tap}`,
    `brew install --cask ${metadata.homebrew.cask}`,
  ];
  assert(
    JSON.stringify(metadata.homebrew.commands) === JSON.stringify(expectedCommands),
    `homebrew.commands must exactly equal ${expectedCommands.join(", ")}`
  );
  assert(!metadata.homebrew.commands.some((command) => command.includes("brew trust --cask")), "homebrew.commands must not use cask-level trust");
  return metadata;
}

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

export function serializeArrasProduct(metadata) {
  return `${JSON.stringify(metadata, null, 2)}\n`;
}
