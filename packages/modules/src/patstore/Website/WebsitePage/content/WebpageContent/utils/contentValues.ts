import {
	WebpageStructuredContainerSchema,
	WebpageStructuredFieldSchema,
	WebpageStructuredLinkValue,
	WebpageStructuredSchema,
	WebpageStructuredSchemaNode,
	WebpageStructuredValueEntry
} from "@repo/types";

const FIELD_TYPES = new Set<WebpageStructuredFieldSchema["type"]>([
	"text",
	"richtext",
	"image",
	"link",
	"collection",
	"file"
]);

export const isFieldNode = (
	node: WebpageStructuredSchemaNode
): node is WebpageStructuredFieldSchema =>
	FIELD_TYPES.has(node.type as WebpageStructuredFieldSchema["type"]);

export const isContainerNode = (
	node: WebpageStructuredSchemaNode
): node is WebpageStructuredContainerSchema =>
	!isFieldNode(node) &&
	"content" in node &&
	node.content !== null &&
	typeof node.content === "object" &&
	!Array.isArray(node.content);

const buildPath = (prefix: string, key: string) =>
	prefix ? `${prefix}.${key}` : key;

export const getCollectionFieldSchema = (
	node: WebpageStructuredFieldSchema
): WebpageStructuredSchema | undefined => {
	if (node.type !== "collection") {
		return undefined;
	}

	return node.fields ?? node.content;
};

export const getCollectionItems = (
	value: unknown
): Record<string, unknown>[] => {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(
		(item): item is Record<string, unknown> =>
			!!item && typeof item === "object" && !Array.isArray(item)
	);
};

export const getEmptyFieldValue = (
	node: WebpageStructuredFieldSchema
): unknown => {
	switch (node.type) {
		case "link":
			return { text: "", href: "" } satisfies WebpageStructuredLinkValue;
		case "collection":
			return [];
		default:
			return "";
	}
};

export const getDefaultFieldValue = (
	node: WebpageStructuredFieldSchema
): unknown => {
	if (node.default !== undefined) {
		return node.default;
	}

	return getEmptyFieldValue(node);
};

export const buildCollectionItem = (
	fields: WebpageStructuredSchema
): Record<string, unknown> => {
	const item: Record<string, unknown> = {};

	for (const [key, node] of Object.entries(fields)) {
		if (!isFieldNode(node) || node.type === "collection") {
			continue;
		}

		item[key] = getDefaultFieldValue(node);
	}

	return item;
};

export const entriesToMap = (
	entries: WebpageStructuredValueEntry[]
): Map<string, unknown> =>
	new Map(entries.map(({ path, value }) => [path, value]));

export const mergeStoredValues = (
	defaults: Map<string, unknown>,
	stored: WebpageStructuredValueEntry[]
): Map<string, unknown> => {
	const merged = new Map(defaults);

	for (const { path, value } of stored) {
		merged.set(path, value);
	}

	return merged;
};

/**
 * Serializes schema values to page_data entries.
 * Collections are a single `{ path, value: [...] }` entry (patstore-kit).
 */
export const serializeValues = (
	schema: WebpageStructuredSchema,
	values: Map<string, unknown>,
	prefix = ""
): WebpageStructuredValueEntry[] => {
	const entries: WebpageStructuredValueEntry[] = [];

	for (const [key, node] of Object.entries(schema)) {
		const path = buildPath(prefix, key);

		if (isContainerNode(node)) {
			entries.push(...serializeValues(node.content, values, path));
			continue;
		}

		if (node.type === "collection") {
			entries.push({
				path,
				value: values.has(path)
					? getCollectionItems(values.get(path))
					: []
			});
			continue;
		}

		entries.push({
			path,
			value: values.has(path)
				? values.get(path)
				: getEmptyFieldValue(node)
		});
	}

	return entries;
};

export const valuesAreEqual = (
	left: WebpageStructuredValueEntry[],
	right: WebpageStructuredValueEntry[]
): boolean => JSON.stringify(left) === JSON.stringify(right);

export const addCollectionItem = (
	basePath: string,
	itemSchema: WebpageStructuredSchema,
	values: Map<string, unknown>
): Map<string, unknown> => {
	const next = new Map(values);
	const items = getCollectionItems(values.get(basePath));
	next.set(basePath, [...items, buildCollectionItem(itemSchema)]);
	return next;
};

export const removeCollectionItem = (
	basePath: string,
	_itemSchema: WebpageStructuredSchema,
	values: Map<string, unknown>,
	removeIndex: number
): Map<string, unknown> => {
	const next = new Map(values);
	const items = getCollectionItems(values.get(basePath));
	next.set(
		basePath,
		items.filter((_, index) => index !== removeIndex)
	);
	return next;
};

export const updateCollectionItemField = (
	basePath: string,
	index: number,
	fieldKey: string,
	fieldValue: unknown,
	values: Map<string, unknown>
): Map<string, unknown> => {
	const next = new Map(values);
	const items = getCollectionItems(values.get(basePath)).map((item) => ({
		...item
	}));
	const current = items[index] ?? {};
	items[index] = { ...current, [fieldKey]: fieldValue };
	next.set(basePath, items);
	return next;
};
