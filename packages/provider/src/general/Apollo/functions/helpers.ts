import { cloneDeep, keysIn } from "lodash-es";

export const getValueFromGraphqlArray = <T>(data: { value: T }[]): T[] => {
	return data.map((item) => item.value);
};

export const sanitizeGraphQlNode = <T extends { [key: string]: any }>(
	node: T
): T | null => {
	const nodeCopy = cloneDeep(node);
	if (!nodeCopy) {
		return null;
	}

	if (!keysIn(nodeCopy)) {
		return nodeCopy;
	}

	Object.keys(nodeCopy).forEach((key) => {
		const value = nodeCopy[key];

		// Check if value is an array of {value: any}
		if (
			Array.isArray(value) &&
			value.length > 0 &&
			value.every(
				(item) => item && typeof item === "object" && "value" in item
			)
		) {
			nodeCopy[key] = value.map((item) => item.value);
		}
	});

	return nodeCopy;
};

export const pluralize = (word: string): string => {
	if (!word) return word;

	const lower = word.toLowerCase();
	const vowels = ["a", "e", "i", "o", "u"];
	const secondToLast = lower[lower.length - 2] ?? "";

	if (lower === "person") {
		return "people";
	}

	// Words ending in consonant + "y" → replace "y" with "ies"
	if (lower.endsWith("y") && !vowels.includes(secondToLast)) {
		return lower.slice(0, -1) + "ies";
	}

	// Words ending in "s", "x", "z", "ch", "sh" → add "es"
	if (
		lower.endsWith("s") ||
		lower.endsWith("x") ||
		lower.endsWith("z") ||
		lower.endsWith("ch") ||
		lower.endsWith("sh")
	) {
		return lower + "es";
	}

	// Default: just add "s"
	return lower + "s";
};
