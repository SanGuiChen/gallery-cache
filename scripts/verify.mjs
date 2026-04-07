import { spawnSync } from "node:child_process";

const shouldPackage = process.argv.includes("--package");

const steps = [
  {
    label: "Frontend build",
    command: "npm",
    args: ["run", "build"],
  },
  {
    label: "Rust tests",
    command: "cargo",
    args: ["test"],
    cwd: "src-tauri",
  },
];

if (shouldPackage) {
  steps.push({
    label: "Desktop package build",
    command: "npm",
    args: ["run", "tauri", "build"],
  });
}

for (const step of steps) {
  console.log(`\n== ${step.label} ==`);
  const result = spawnSync(step.command, step.args, {
    cwd: step.cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nAll checks passed.");
