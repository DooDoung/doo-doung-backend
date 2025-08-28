import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "seed.js",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs",
      ".husky/**",
      "prisma/**",
      "generated/**",
    ],
  },

  // Merge JS + TS recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Custom overrides for your TS source files
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // General ESLint rules
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  prettierConfig
)
