import { FilterFieldDefinition } from "../types";

type PathMap = Map<string, "boolean" | "string">;

const collectLeafPaths = (
	obj: Record<string, unknown> | undefined,
	prefix = ""
): PathMap => {
	const paths: PathMap = new Map();

	if (!obj || typeof obj !== "object") {
		return paths;
	}

	Object.entries(obj).forEach(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;

		if (
			value !== null &&
			typeof value === "object" &&
			!Array.isArray(value)
		) {
			collectLeafPaths(
				value as Record<string, unknown>,
				path
			).forEach((type, nestedPath) => {
				paths.set(nestedPath, type);
			});
			return;
		}

		if (typeof value === "boolean") {
			paths.set(path, "boolean");
		} else if (typeof value === "string" && value.trim() !== "") {
			paths.set(path, "string");
		}
	});

	return paths;
};

export const extractNestedFieldPaths = (
	dataObjects: Record<string, unknown>[]
): FilterFieldDefinition[] => {
	const pathTypes: PathMap = new Map();

	dataObjects.forEach((obj) => {
		collectLeafPaths(obj).forEach((type, path) => {
			const existing = pathTypes.get(path);
			if (!existing || existing === "string") {
				pathTypes.set(path, type);
			}
		});
	});

	return Array.from(pathTypes.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, inputType]) => ({
			key,
			label: key,
			inputType:
				inputType === "boolean"
					? ("boolean" as const)
					: ("select" as const)
		}));
};

export default extractNestedFieldPaths;
