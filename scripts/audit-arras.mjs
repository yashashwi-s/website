import { spawn } from "node:child_process";

const port = process.env.ARRAS_AUDIT_PORT || "3199";
const env = { ...process.env, ARRAS_METADATA_OFFLINE: "1", PORT: port };

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", env, ...options });
    child.on("error", reject);
    child.on("exit", (code, signal) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited ${code ?? signal}`)));
  });
}

await run("node", ["scripts/check-arras-product.mjs"]);
await run("npm", ["run", "build"]);

const server = spawn("npm", ["start"], { stdio: "inherit", env });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`production server exited ${server.exitCode}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/puremac/arras`);
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("production server did not become ready");
  await run("node", ["scripts/check-puremac-aeo.mjs", "--arras-only"], {
    env: {
      ...env,
      ARRAS_REQUEST_BASE_URL: `http://127.0.0.1:${port}`,
      ARRAS_REQUEST_HOST: "arras.localhost",
    },
  });
} finally {
  if (server.exitCode === null) {
    await new Promise(resolve => {
      server.once("exit", resolve);
      server.kill("SIGTERM");
    });
  }
}

console.log("Deterministic offline Arras production audit passed.");
