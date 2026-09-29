const EXPECTED = Object.freeze({
  canonicalUrl: "https://arras.yashashwi.me/",
  repositoryUrl: "https://github.com/yashashwi-s/Arras",
  publisherUrl: "https://yashashwi.me/",
  releaseUrl: "https://github.com/yashashwi-s/Arras/releases/latest",
  sourceUrl: "https://github.com/yashashwi-s/Arras",
  featureUrl: "https://github.com/yashashwi-s/Arras/blob/main/FEATURES.md",
  architectureUrl: "https://github.com/yashashwi-s/Arras/blob/main/ARCHITECTURE.md",
  securityPolicyUrl: "https://github.com/yashashwi-s/Arras/blob/main/SECURITY.md",
  licenseUrl: "https://github.com/yashashwi-s/Arras/blob/main/LICENSE",
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function object(value, field) {
  assert(value && typeof value === "object" && !Array.isArray(value), `${field} must be an object`);
}

function text(value, field) {
  assert(typeof value === "string" && value.trim() === value && value.length > 0, `${field} must be a non-empty string`);
}

function exactUrl(value, field, expected) {
  text(value, field);
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${field} must be a valid URL`); }
  assert(parsed.protocol === "https:" && !parsed.username && !parsed.password, `${field} must be a credential-free HTTPS URL`);
  assert(value === expected, `${field} must be ${expected}`);
}

export function validateArrasProduct(metadata) {
  object(metadata, "product metadata");
  assert(metadata.schemaVersion === 2, "schemaVersion must be 2");
  for (const field of ["name", "category", "shortDescription", "repositoryDescription", "bundleIdentifier", "minimumMacOS", "featureContractPath"]) text(metadata[field], field);
  assert(metadata.name === "Arras", 'name must be "Arras"');
  assert(/^\d+\.\d+$/.test(metadata.minimumMacOS), "minimumMacOS must use major.minor form");
  assert(metadata.featureContractPath === "FEATURES.md", "featureContractPath must be FEATURES.md");
  exactUrl(metadata.canonicalUrl, "canonicalUrl", EXPECTED.canonicalUrl);
  exactUrl(metadata.repositoryUrl, "repositoryUrl", EXPECTED.repositoryUrl);

  object(metadata.publisher, "publisher");
  text(metadata.publisher.name, "publisher.name");
  exactUrl(metadata.publisher.url, "publisher.url", EXPECTED.publisherUrl);
  assert(Array.isArray(metadata.historicalNames), "historicalNames must be an array");
  metadata.historicalNames.forEach((name, index) => text(name, `historicalNames[${index}]`));

  object(metadata.documentation, "documentation");
  exactUrl(metadata.documentation.mainUrl, "documentation.mainUrl", EXPECTED.canonicalUrl);
  exactUrl(metadata.documentation.installationUrl, "documentation.installationUrl", `${EXPECTED.canonicalUrl}#install`);
  exactUrl(metadata.documentation.quickStartUrl, "documentation.quickStartUrl", `${EXPECTED.canonicalUrl}faqs#how-to-use`);
  exactUrl(metadata.documentation.faqUrl, "documentation.faqUrl", `${EXPECTED.canonicalUrl}faqs`);
  exactUrl(metadata.documentation.securityUrl, "documentation.securityUrl", `${EXPECTED.canonicalUrl}security`);
  exactUrl(metadata.documentation.featureContractUrl, "documentation.featureContractUrl", EXPECTED.featureUrl);
  exactUrl(metadata.documentation.architectureUrl, "documentation.architectureUrl", EXPECTED.architectureUrl);
  exactUrl(metadata.documentation.securityPolicyUrl, "documentation.securityPolicyUrl", EXPECTED.securityPolicyUrl);

  object(metadata.publicRelease, "publicRelease");
  exactUrl(metadata.publicRelease.sourceUrl, "publicRelease.sourceUrl", EXPECTED.releaseUrl);
  assert(Array.isArray(metadata.publicRelease.architectures) && metadata.publicRelease.architectures.length > 0, "publicRelease.architectures must be a non-empty array");
  assert(new Set(metadata.publicRelease.architectures).size === metadata.publicRelease.architectures.length, "publicRelease.architectures must be unique");
  metadata.publicRelease.architectures.forEach((architecture, index) => assert(["arm64", "x86_64"].includes(architecture), `publicRelease.architectures[${index}] is unsupported`));
  assert(["ad-hoc", "developer-id", "unsigned"].includes(metadata.publicRelease.signing), "publicRelease.signing is unsupported");
  assert(typeof metadata.publicRelease.notarized === "boolean", "publicRelease.notarized must be boolean");

  object(metadata.sourceBuild, "sourceBuild");
  exactUrl(metadata.sourceBuild.sourceUrl, "sourceBuild.sourceUrl", EXPECTED.sourceUrl);
  assert(typeof metadata.sourceBuild.intelSupported === "boolean", "sourceBuild.intelSupported must be boolean");
  object(metadata.license, "license");
  assert(metadata.license.spdx === "MIT", 'license.spdx must be "MIT"');
  exactUrl(metadata.license.url, "license.url", EXPECTED.licenseUrl);
  assert(typeof metadata.telemetry === "boolean", "telemetry must be boolean");
  assert(!Object.hasOwn(metadata, "homebrew"), "retired homebrew metadata is forbidden");
  return metadata;
}

export function serializeArrasProduct(metadata) {
  return `${JSON.stringify(validateArrasProduct(metadata), null, 2)}\n`;
}
