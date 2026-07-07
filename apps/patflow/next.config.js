/** @type {import('next').NextConfig} */
const {
	createAppEnv,
	createImageRemotePatterns,
	getPrefixedEnv,
} = require("../env/createNextEnv");

const APP_PREFIX = "PATFLOW";

const nextConfig = {
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
};

module.exports = nextConfig;
