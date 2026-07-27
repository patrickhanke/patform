import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		include: [
			"packages/**/src/**/*.test.ts",
			"apps/**/**/*.test.{ts,tsx}",
		],
		environment: "node",
		environmentMatchGlobs: [
			["apps/**", "jsdom"],
			["**/*.test.tsx", "jsdom"],
		],
		setupFiles: ["./vitest.setup.ts"],
		passWithNoTests: false,
	},
});
