import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		passWithNoTests: false,
		projects: [
			{
				test: {
					name: "unit",
					include: ["packages/**/src/**/*.test.ts"],
					environment: "node",
					setupFiles: ["./vitest.setup.ts"],
				},
			},
			{
				test: {
					name: "dom",
					include: ["apps/**/*.test.ts", "apps/**/*.test.tsx"],
					environment: "jsdom",
					setupFiles: ["./vitest.setup.ts"],
				},
			},
		],
	},
});
