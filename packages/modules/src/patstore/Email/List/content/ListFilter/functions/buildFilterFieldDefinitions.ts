import { Field } from "@repo/ui";
import { Module, ModuleField, ModuleFieldType, PatstoreUser } from "@repo/types";
import {
	FilterFieldDefinition,
	FilterFieldInputType,
	ListFilterItem
} from "../types";
import extractNestedFieldPaths from "./extractNestedFieldPaths";
import getUserFieldValue from "./getUserFieldValue";

const STRING_VALUE_LIMIT = 4;

const mapModuleFieldType = (
	type: ModuleFieldType
): "boolean" | "string" | null => {
	switch (type) {
		case "boolean":
			return "boolean";
		case "string":
		case "edit_string":
		case "textfield":
		case "edit_textfield":
		case "texteditor":
		case "edit_texteditor":
		case "date":
		case "state":
		case "edit_state":
		case "edit_role":
			return "string";
		default:
			return null;
	}
};

const mapFieldType = (type: string): "boolean" | "string" | null => {
	if (type === "toggle" || type === "select_toggle") {
		return "boolean";
	}
	if (
		type === "input" ||
		type === "url" ||
		type === "textarea" ||
		type === "texteditor" ||
		type === "select" ||
		type === "number" ||
		type === "password"
	) {
		return "string";
	}
	return null;
};

const buildStringInputType = (
	uniqueValues: Set<string>
): FilterFieldInputType => {
	return uniqueValues.size > STRING_VALUE_LIMIT ? "text" : "select";
};

const collectUniqueStringValues = (
	users: PatstoreUser[],
	key: string
): Set<string> => {
	const values = new Set<string>();

	users.forEach((user) => {
		const value = getUserFieldValue(user, key);
		if (typeof value === "string" && value.trim() !== "") {
			values.add(value);
		}
	});

	return values;
};

const buildModuleFieldDefinitions = (
	activeFields: ModuleField[],
	users: PatstoreUser[]
): FilterFieldDefinition[] => {
	return activeFields
		.map((field) => {
			const inputType = mapModuleFieldType(field.type);
			if (!inputType) {
				return null;
			}

			if (inputType === "boolean") {
				return {
					key: field.id,
					label: field.label,
					inputType: "boolean" as const
				};
			}

			const uniqueValues = collectUniqueStringValues(users, field.id);
			const resolvedInputType = buildStringInputType(uniqueValues);

			return {
				key: field.id,
				label: field.label,
				inputType: resolvedInputType,
				options:
					resolvedInputType === "select"
						? Array.from(uniqueValues)
								.sort()
								.map((value) => ({
									label: value,
									value
								}))
						: undefined
			};
		})
		.filter(Boolean) as FilterFieldDefinition[];
};

const buildCustomFieldDefinitions = (
	fields: Field[],
	users: PatstoreUser[],
	source: "data" | "settings"
): FilterFieldDefinition[] => {
	return fields
		.map((field) => {
			const mappedType = mapFieldType(field.type);
			if (!mappedType) {
				return null;
			}

			const key = field.name;
			const label = `${field.label} (${source === "data" ? "Data" : "Settings"})`;

			if (mappedType === "boolean") {
				return {
					key,
					label,
					inputType: "boolean" as const
				};
			}

			const uniqueValues = collectUniqueStringValues(users, key);
			const inputType = buildStringInputType(uniqueValues);

			return {
				key,
				label,
				inputType,
				options:
					inputType === "select"
						? Array.from(uniqueValues)
								.sort()
								.map((value) => ({
									label: value,
									value
								}))
						: undefined
			};
		})
		.filter(Boolean) as FilterFieldDefinition[];
};

const mergeFieldDefinitions = (
	definitions: FilterFieldDefinition[]
): FilterFieldDefinition[] => {
	const merged = new Map<string, FilterFieldDefinition>();

	definitions.forEach((definition) => {
		if (!merged.has(definition.key)) {
			merged.set(definition.key, definition);
		}
	});

	return Array.from(merged.values()).sort((a, b) =>
		a.label.localeCompare(b.label)
	);
};

export const buildFilterFieldDefinitions = (
	userModule: Module | undefined,
	users: PatstoreUser[]
): FilterFieldDefinition[] => {
	if (!userModule) {
		return [];
	}

	const activeFields =
		userModule.fields?.filter((field) => field.active) || [];

	const moduleDefinitions = buildModuleFieldDefinitions(activeFields, users);

	const dataFieldDefinitions = buildCustomFieldDefinitions(
		userModule.data_fields || [],
		users,
		"data"
	);

	const settingFieldDefinitions = buildCustomFieldDefinitions(
		userModule.setting_fields || [],
		users,
		"settings"
	);

	const nestedDataDefinitions = extractNestedFieldPaths(
		users.map((user) => (user.data || {}) as Record<string, unknown>)
	).map((definition) => {
		if (definition.inputType === "boolean") {
			return definition;
		}

		const uniqueValues = collectUniqueStringValues(users, definition.key);
		return {
			...definition,
			inputType: buildStringInputType(uniqueValues),
			options:
				uniqueValues.size <= STRING_VALUE_LIMIT
					? Array.from(uniqueValues)
							.sort()
							.map((value) => ({ label: value, value }))
					: undefined
		};
	});

	const nestedSettingsDefinitions = extractNestedFieldPaths(
		users.map(
			(user) => (user.settings || {}) as Record<string, unknown>
		)
	).map((definition) => {
		const settingsKey = `settings.${definition.key}`;
		const uniqueValues = collectUniqueStringValues(users, settingsKey);

		if (definition.inputType === "boolean") {
			return {
				key: settingsKey,
				label: `${definition.label} (Settings)`,
				inputType: "boolean" as const
			};
		}

		return {
			key: settingsKey,
			label: `${definition.label} (Settings)`,
			inputType: buildStringInputType(uniqueValues),
			options:
				uniqueValues.size <= STRING_VALUE_LIMIT
					? Array.from(uniqueValues)
							.sort()
							.map((value) => ({ label: value, value }))
					: undefined
		};
	});

	return mergeFieldDefinitions([
		...moduleDefinitions,
		...dataFieldDefinitions,
		...settingFieldDefinitions,
		...nestedDataDefinitions,
		...nestedSettingsDefinitions
	]);
};

export const matchUsersAgainstFilters = (
	users: PatstoreUser[],
	filters: ListFilterItem[]
): PatstoreUser[] => {
	if (filters.length === 0) {
		return users;
	}

	return users.filter((user) =>
		filters.every((filter) => {
			const userValue = getUserFieldValue(user, filter.key);

			if (typeof filter.value === "boolean") {
				return userValue === filter.value;
			}

			if (typeof filter.value === "string") {
				return String(userValue ?? "")
					.toLowerCase()
					.includes(filter.value.toLowerCase());
			}

			return false;
		})
	);
};

export default buildFilterFieldDefinitions;
