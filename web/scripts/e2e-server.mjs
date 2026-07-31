import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Sobe o output standalone do Next na porta 3005 para o Playwright.
 * `next start` não é compatível com output: "standalone".
 */
const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const serverJs = path.join(standalone, "server.js");

if (!fs.existsSync(serverJs)) {
  console.error("Missing .next/standalone/server.js — run `pnpm build` first.");
  process.exit(1);
}

fs.mkdirSync(path.join(standalone, ".next"), { recursive: true });
fs.cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});
fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
});

const child = spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: "3005",
    HOSTNAME: "127.0.0.1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
