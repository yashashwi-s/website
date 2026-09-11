import { indexNowKey } from "@/lib/indexnow.mjs";
export const dynamic = "force-static";
export function GET() { return new Response(indexNowKey, { headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
