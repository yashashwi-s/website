import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

// Use the HTTP transport for preview host routing: fetch can normalize Host.
// Leave redirects visible so audits can assert their status and destination.
export function requestPage(url, { headers = {}, timeout = 20000 } = {}) {
  return new Promise((resolve, reject) => {
    const request = (new URL(url).protocol === "https:" ? httpsRequest : httpRequest)(url, { headers }, response => {
      const chunks = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("error", reject);
      response.on("end", () => resolve(new Response(Buffer.concat(chunks), {
        status: response.statusCode,
        headers: Object.fromEntries(Object.entries(response.headers).filter(([, value]) => value !== undefined)),
      })));
    });
    request.on("error", reject);
    request.setTimeout(timeout, () => request.destroy(new Error(`Page request timed out: ${url}`)));
    request.end();
  });
}
