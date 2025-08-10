#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get commit message from file
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("❌ No commit message file provided");
  process.exit(1);
}

const commitMessage = fs.readFileSync(commitMsgFile, "utf8").trim();

// Define allowed prefixes
const allowedPrefixes = [
  "add",
  "chore",
  "fix",
  "feat",
  "docs",
  "style",
  "refactor",
  "test",
  "perf",
  "ci",
  "build",
  "revert",
];

// Check if commit message starts with allowed prefix
const hasValidPrefix = allowedPrefixes.some((prefix) =>
  commitMessage.startsWith(`${prefix}:`)
);

if (!hasValidPrefix) {
  console.log("❌ Invalid commit message format!");
  console.log("");
  console.log(
    "Commit message must start with one of the following prefixes followed by a colon:"
  );
  allowedPrefixes.forEach((prefix) => {
    const descriptions = {
      add: "for adding new features or files",
      chore: "for maintenance tasks",
      fix: "for bug fixes",
      feat: "for new features",
      docs: "for documentation changes",
      style: "for formatting changes",
      refactor: "for code refactoring",
      test: "for adding or modifying tests",
      perf: "for performance improvements",
      ci: "for CI/CD changes",
      build: "for build system changes",
      revert: "for reverting changes",
    };
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
