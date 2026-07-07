const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

/** @typedef {Record<string, string | undefined>} EnvMap */

const SHARED_ENV_KEYS = [
	"SASHIDO_API_URL",
	"SASHIDO_GQL_URL",
	"SASHIDO_APP_ID",
	"SASHIDO_REST_KEY",
	"SASHIDO_MASTER_KEY",
	"SASHIDO_JS_KEY",
	"SASHIDO_FILE_URL",
	"SASHIDO_CLIENT_KEY",
	"SESSION_TOKEN",
	"APP_NAME",
	"FIREBASE_API_KEY",
	"FIREBASE_AUTH_DOMAIN",
	"FIREBASE_PROJECT_ID",
	"FIREBASE_STORAGE_BUCKET",
	"FIREBASE_MESSAGING_SENDER_ID",
	"FIREBASE_APP_ID",
	"GCMS_SENDER_ID",
];

/**
 * Maps `{PREFIX}_{KEY}` from the root `.env` to runtime `{KEY}` for Next.js.
 * @param {string} prefix e.g. `PATFLOW` or `PATSTORE`
 * @param {EnvMap} [extra] app-specific runtime keys
 * @returns {EnvMap}
 */
function createAppEnv(prefix, extra = {}) {
	/** @type {EnvMap} */
	const env = {};

	for (const key of SHARED_ENV_KEYS) {
		const value =
			process.env[`${prefix}_${key}`] ?? process.env[key];
		if (value !== undefined && value !== "") {
			env[key] = value;
		}
	}

	for (const [key, value] of Object.entries(extra)) {
		if (value !== undefined && value !== "") {
			env[key] = value;
		}
	}

	return env;
}

/**
 * @param {string} prefix
 * @param {string} key
 * @returns {string | undefined}
 */
function getPrefixedEnv(prefix, key) {
	const value = process.env[`${prefix}_${key}`] ?? process.env[key];
	return value !== undefined && value !== "" ? value : undefined;
}

/**
 * @param {string} prefix
 * @returns {string | undefined}
 */
function getSashidoFileHostname(prefix) {
	const fileUrl =
		process.env[`${prefix}_SASHIDO_FILE_URL`] ??
		process.env.SASHIDO_FILE_URL;
	if (!fileUrl) {
		return undefined;
	}

	try {
		return new URL(fileUrl).hostname;
	} catch {
		return undefined;
	}
}

/**
 * @param {string} prefix
 */
function createImageRemotePatterns(prefix) {
	const sashidoHostname = getSashidoFileHostname(prefix);

	/** @type {import('next/dist/shared/lib/image-config').RemotePattern[]} */
	const patterns = [
		{
			protocol: "https",
			hostname: "upcdn.io",
			port: "",
			pathname: "/**",
		},
	];

	if (sashidoHostname) {
		patterns.unshift({
			protocol: "https",
			hostname: sashidoHostname,
			port: "",
			pathname: "/**",
		});
	}

	return patterns;
}

module.exports = {
	createAppEnv,
	createImageRemotePatterns,
	getPrefixedEnv,
};
