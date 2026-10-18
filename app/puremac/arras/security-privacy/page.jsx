// Legacy public URLs redirect to /security in next.config.mjs.
// Direct implementation-path requests also render the single current policy.
export { default, metadata } from "../security/page";
