const path = require("path");

/** @type {import('next').NextConfig} */
const {
	createAppEnv,
	createImageRemotePatterns,
	getPrefixedEnv,
} = require("../env/createNextEnv");

const APP_PREFIX = "PATSTORE";

module.exports = {
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
	sassOptions: {
		includePaths: [path.join(__dirname, "../../packages/styles/src")],
	},
	env: createAppEnv(APP_PREFIX, {
		PATSTORE_NEXT_LETTERMINT_KEY: getPrefixedEnv(
			APP_PREFIX,
			"PATSTORE_NEXT_LETTERMINT_KEY"
		),
	}),
	images: {
		remotePatterns: createImageRemotePatterns(APP_PREFIX),
	},
};
