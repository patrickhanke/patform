// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@repo/eslint/library.js"],
  parser: "@typescript-eslint/parser",
  rules: {
    "global-require": 0,
    // 'no-restricted-globals': ['error', 'navigator', 'window', 'document']
  },
  parserOptions: {
    project: true,
  },
};

export default config;
