import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();

const checks = [
  {
    label: "Node.js",
    command: "node",
    args: ["-v"],
    required: true,
    hint: "安装 Node.js 20+。",
  },
  {
    label: "npm",
    command: "npm",
    args: ["-v"],
    required: true,
    hint: "安装 npm，或重新安装 Node.js。",
  },
  {
    label: "Rust",
    command: "rustc",
    args: ["-V"],
    required: true,
    hint: "通过 https://rustup.rs 安装 Rust。",
  },
  {
    label: "Cargo",
    command: "cargo",
    args: ["-V"],
    required: true,
    hint: "Rust 安装完成后会自带 Cargo。",
  },
];

const fileChecks = [
  { label: "package.json", path: "package.json", required: true },
  { label: "src-tauri/Cargo.toml", path: "src-tauri/Cargo.toml", required: true },
  { label: "src-tauri/tauri.conf.json", path: "src-tauri/tauri.conf.json", required: true },
  { label: "node_modules", path: "node_modules", required: false },
  { label: "src-tauri/icons/icon.ico", path: "src-tauri/icons/icon.ico", required: true },
];

let failed = false;

function runCheck({ label, command, args, required, hint }) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
  });

  if (result.status === 0) {
    console.log(`OK   ${label}: ${result.stdout.trim()}`);
    return;
  }

  const message = result.error?.message || result.stderr.trim() || "unknown error";
  const prefix = required ? "FAIL" : "WARN";
  console.log(`${prefix} ${label}: ${message}`);
  if (hint) console.log(`     ${hint}`);
  if (required) failed = true;
}

console.log("Gallery Cache harness doctor");
console.log(`Workspace: ${root}`);
console.log("");

for (const check of checks) {
  runCheck(check);
}

console.log("");
for (const check of fileChecks) {
  const fullPath = path.join(root, check.path);
  if (existsSync(fullPath)) {
    console.log(`OK   ${check.label}: ${check.path}`);
  } else {
    const prefix = check.required ? "FAIL" : "WARN";
    console.log(`${prefix} ${check.label}: missing ${check.path}`);
    if (check.required) failed = true;
  }
}

console.log("");
console.log("Next steps");
console.log("1. Run `npm install` if `node_modules` is missing.");
console.log("2. Run `npm run verify` before and after any code change.");
console.log("3. Use `npm run package:desktop` only when you need a packaged desktop build.");

if (failed) {
  process.exitCode = 1;
}
