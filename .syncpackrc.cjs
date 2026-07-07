/** @type {import("syncpack").RcFile} */
const config = {
	indent: "\t",
	semverGroups: [
		{
			label: "Workspace packages use * protocol",
			packages: ["**"],
			dependencies: ["@repo/**"],
			dependencyTypes: ["dev", "prod", "peer"],
			semverRange: "*",
		},
	],
	versionGroups: [
		{
			label: "Local workspace packages use * where declared",
			packages: ["**"],
			dependencies: ["@repo/**"],
			dependencyTypes: ["dev", "prod"],
			pinVersion: "*",
		},
	],
};

module.exports = config;
