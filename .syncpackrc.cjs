/** @type {import("syncpack").RcFile} */
const config = {
	indent: "\t",
	semverGroups: [
		{
			label: "Workspace packages use * protocol",
			packages: ["**"],
			dependencies: ["@repo/**"],
			dependencyTypes: ["dev", "prod", "peer"],
			range: "*",
		},
	],
	versionGroups: [
		{
			label: "Turbo tracks the latest release",
			packages: ["**"],
			dependencies: ["turbo"],
			isIgnored: true,
		},
		{
			label: "Local workspace packages use * where declared",
			packages: ["**"],
			dependencies: ["@repo/**"],
			dependencyTypes: ["dev", "prod", "peer"],
			pinVersion: "*",
		},
		{
			label: "Singletons use one range in every workspace",
			packages: ["**"],
			dependencies: [
				"react",
				"react-dom",
				"@types/react",
				"@types/react-dom",
				"next",
				"typescript",
				"eslint",
				"@types/node",
			],
			dependencyTypes: ["dev", "prod", "peer"],
			policy: "sameRange",
		},
	],
};

module.exports = config;
