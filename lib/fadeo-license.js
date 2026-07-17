import crypto from "node:crypto";

// Mirrors FadeoCore/License.swift's format exactly: FADEO1.<payload-b64url>.<sig-b64url>,
// Ed25519 over the raw JSON payload bytes. Verified cross-compatible with CryptoKit's
// Curve25519.Signing (both are RFC 8032 Ed25519) before this shipped.
const PREFIX = "FADEO1";

// DER prefix for an Ed25519 PKCS8 private key (OID 1.3.101.112), fixed for any 32-byte seed.
const PKCS8_ED25519_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");

function base64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(s) {
  let t = String(s).replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  return Buffer.from(t, "base64");
}

function privateKeyFromHex(hex) {
  const seed = Buffer.from(hex, "hex");
  if (seed.length !== 32) throw new Error("FADEO_LICENSE_PRIVATE_KEY must be a 32-byte hex seed");
  return crypto.createPrivateKey({
    key: Buffer.concat([PKCS8_ED25519_PREFIX, seed]),
    format: "der",
    type: "pkcs8",
  });
}

// `mustActivateBy`: only set for free-giveaway keys (see the promo route). Mirrors
// LicensePayload.mustActivateBy in License.swift -- omitted entirely (not just null) for
// paid keys, matching the Swift side's optional-decodes-as-nil handling of a missing key.
export function signLicense({ note, mustActivateBy } = {}) {
  const privateKeyHex = process.env.FADEO_LICENSE_PRIVATE_KEY;
  if (!privateKeyHex) throw new Error("FADEO_LICENSE_PRIVATE_KEY is not set");

  const isoNoFraction = (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
  const payload = {
    id: crypto.randomUUID(),
    issuedAt: isoNoFraction(new Date()), // matches Swift .iso8601 (no fractional seconds)
    note: note ?? null,
    ...(mustActivateBy ? { mustActivateBy: isoNoFraction(mustActivateBy) } : {}),
  };
  const payloadBytes = Buffer.from(JSON.stringify(payload));
  const privateKey = privateKeyFromHex(privateKeyHex);
  const signature = crypto.sign(null, payloadBytes, privateKey);

  return {
    key: `${PREFIX}.${base64url(payloadBytes)}.${base64url(signature)}`,
    id: payload.id,
    mustActivateBy: payload.mustActivateBy ?? null,
  };
}

// Verifies a FADEO1 key's Ed25519 signature against the public key derived from our own
// signing seed, and returns its decoded payload (id, note, optional mustActivateBy) or null.
// Used by the activation endpoint so only genuinely-issued keys can mark themselves active
// (a forged or arbitrary id can't grief the reclaim sweep).
export function verifyLicense(key) {
  const privateKeyHex = process.env.FADEO_LICENSE_PRIVATE_KEY;
  if (!privateKeyHex || typeof key !== "string") return null;
  const parts = key.split(".");
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  let payloadBytes, signature, payload;
  try {
    payloadBytes = fromBase64url(parts[1]);
    signature = fromBase64url(parts[2]);
    payload = JSON.parse(payloadBytes.toString("utf8"));
  } catch {
    return null;
  }
  try {
    const publicKey = crypto.createPublicKey(privateKeyFromHex(privateKeyHex));
    if (!crypto.verify(null, payloadBytes, publicKey, signature)) return null;
  } catch {
    return null;
  }
  return payload;
}
