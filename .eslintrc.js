// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@repo/eslint-config/library.js", "turbo"],
  parser: "@typescript-eslint/parser",
  rules: {
		'global-require': 0,

  },
  parserOptions: {
    project: true,
  },
};
