const path = require("path");

/** @type {import('next').NextConfig} */
const {
	createAppEnv,
	createImageRemotePatterns,
	getPrefixedEnv,
} = require("../env/createNextEnv");

const APP_PREFIX = "PATFLOW";

const nextConfig = {
	cacheComponents: true,
	transpilePackages: [
		"@repo/ui",
		"@repo/provider",
		"@repo/modules",
		"@repo/types",
	],
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "../../packages/styles/src")],
	},
	env: createAppEnv(APP_PREFIX, {
		FIREBASE_MEASUREMENT_ID: getPrefixedEnv(
			APP_PREFIX,
			"FIREBASE_MEASUREMENT_ID"
		),
		INSTALLATION_ID: getPrefixedEnv(APP_PREFIX, "INSTALLATION_ID"),
	}),
	images: {
		remotePatterns: createImageRemotePatterns(APP_PREFIX),
	},
	webpack: (config, { dev }) => {
		if (dev) {
			config.infrastructureLogging = {
				...config.infrastructureLogging,
				level: "error",
			};
		}
		return config;
	},
};

module.exports = nextConfig;
