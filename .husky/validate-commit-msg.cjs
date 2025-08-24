#!/usr/bin/env node

const fs = require("fs");

// Get commit message from file
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("❌ No commit message file provided");
  process.exit(1);
}

const commitMessage = fs.readFileSync(commitMsgFile, "utf8").trim();

// Define allowed prefixes (updated list)
const allowedPrefixes = [
  "add",
  "fix",
  "update",
  "remove",
  "chore",
  "docs",
  "style",
  "refactor",
  "test",
  "config",
  "build",
  "ci",
  "perf",
  "revert",
];

// Descriptions for each prefix
const descriptions = {
  add: "for adding new features or files",
  fix: "for bug fixes",
  update: "for general updates or enhancements",
  remove: "for removing code, files, or dependencies",
  chore: "for maintenance tasks",
  docs: "for documentation changes",
  style: "for formatting changes",
  refactor: "for code refactoring",
  test: "for adding or modifying tests",
  config: "for configuration changes",
  build: "for build system changes",
  ci: "for CI/CD changes",
  perf: "for performance improvements",
  revert: "for reverting changes",
};

// Check if commit message starts with allowed prefix
const hasValidPrefix = allowedPrefixes.some((prefix) =>
  commitMessage.startsWith(`${prefix}:`)
);

if (!hasValidPrefix) {
  console.log("❌ Invalid commit message format!");
  console.log("");
  console.log(
    "Commit message must start with one of the following prefixes followed by a colon:\n"
  );
  allowedPrefixes.forEach((prefix) => {
    console.log(`  • ${prefix}: ${descriptions[prefix]}`);
  });
  console.log("");
  console.log(`Example: 'add: new user authentication feature'`);
  console.log(`Your message: '${commitMessage}'`);
  console.log("");
  process.exit(1);
}

console.log("✅ Commit message format is valid!");
process.exit(0);
