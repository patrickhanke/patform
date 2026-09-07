import { Field, Module, ModuleFieldType, ModuleFilterType } from "@repo/types";

export type FilterFieldType = ModuleFilterType | "number";

export type FilterFieldOption = {
	value: string;
	label: string;
	type: FilterFieldType;
	className?: string;
};

export type OperatorTemplateOption = {
	value: string;
	label: string;
	type: Field["type"];
	select_options?: { label: string; value: string }[];
	className?: string;
};

const POINTER_TEMPLATES: OperatorTemplateOption[] = [
	{
		value: '{"have":{"objectId":{"equalTo":"{{value}}"}}}',
		label: "Pointer objectId",
		type: "input"
	},
	{
		value: '{"have":{"id":{"equalTo":"{{value}}"}}}',
		label: "Pointer id",
		type: "input"
	}
];

const normalizeClassName = (className?: string) => {
	if (!className) {
		return undefined;
	}
	return className === "_User" ? "User" : className;
};

const getModuleFieldClassName = (type: ModuleFieldType): string | undefined => {
	switch (type) {
		case "person":
		case "edit_person":
		case "edit_persons":
			return "Person";
		case "location":
			return "Location";
		case "updated_by":
		case "created_by":
		case "user":
			return "User";
		case "edit_role":
			return "Role";
		default:
			return undefined;
	}
};

const getModuleFieldFilterType = (
	type: ModuleFieldType
): FilterFieldType | null => {
	switch (type) {
		case "string":
		case "edit_string":
		case "textfield":
		case "edit_textfield":
		case "texteditor":
		case "edit_texteditor":
		case "date":
		case "state":
		case "edit_state":
		case "slug":
		case "lang":
			return "string";
		case "boolean":
			return "boolean";
		case "person":
		case "edit_person":
		case "location":
			return "id";
		case "edit_persons":
		case "edit_role":
			return "ids";
		case "updated_by":
		case "created_by":
		case "user":
			return "pointer";
		default:
			return null;
	}
};

const getCustomFieldFilterType = (
	type: Field["type"]
): FilterFieldType | null => {
	switch (type) {
		case "toggle":
		case "select_toggle":
		case "checkbox":
			return "boolean";
		case "number":
			return "number";
		case "pointer_select":
			return "pointer";
		case "select":
		case "input":
		case "url":
		case "textarea":
		case "texteditor":
		case "password":
			return "string";
		default:
			return null;
	}
};

export const getFilterFieldOptions = (
	userModule: Module
): FilterFieldOption[] => {
	const options: FilterFieldOption[] = [
		{
			value: "data",
			label: "Data",
			type: "search"
		},
		{
			value: "settings",
			label: "Settings",
			type: "search"
		}
	];

	(userModule.fields || [])
		.filter((field) => field.active)
		.forEach((field) => {
			const type = getModuleFieldFilterType(field.type);
			if (type) {
				options.push({
					value: field.id,
					label: field.label,
					type,
					className: getModuleFieldClassName(field.type)
				});
			}
		});

	return options;
};

const mapTemplateFields = (fields: Field[] = []): OperatorTemplateOption[] =>
	fields
		.map((field) => {
			if (!getCustomFieldFilterType(field.type)) {
				return null;
			}

			return {
				value: field.name,
				label: field.label,
				type: field.type,
				select_options:
					field.type === "select" ? field.select_options : undefined,
				className:
					field.type === "pointer_select"
						? normalizeClassName(field.options?.pointer_class)
						: undefined
			};
		})
		.filter(Boolean) as OperatorTemplateOption[];

export const SEARCH_FILTER_KEY = "search";

export const getQueryKey = (option: FilterFieldOption | null | undefined) => {
	if (!option) {
		return "";
	}
	return option.type === "search" ? SEARCH_FILTER_KEY : option.value;
};

export const resolveSearchSource = (
	userModule: Module,
	searchPath?: string
): "data" | "settings" | undefined => {
	if (!searchPath) {
		return undefined;
	}

	if (
		(userModule.data_fields || []).some(
			(field) => field.name === searchPath
		)
	) {
		return "data";
	}

	if (
		(userModule.setting_fields || []).some(
			(field) => field.name === searchPath
		)
	) {
		return "settings";
	}

	return undefined;
};

export const getUiFieldKey = (
	filter: { key: string; operatorTemplate?: string },
	userModule: Module
) => {
	if (filter.key === SEARCH_FILTER_KEY) {
		return resolveSearchSource(userModule, filter.operatorTemplate) || "";
	}

	return filter.key;
};

export const getOperatorTemplateOptions = (
	userModule: Module,
	fieldKey: string,
	fieldType?: FilterFieldType
): OperatorTemplateOption[] => {
	if (fieldType === "pointer") {
		return POINTER_TEMPLATES;
	}

	if (fieldKey === "data") {
		return mapTemplateFields(userModule.data_fields);
	}

	if (fieldKey === "settings") {
		return mapTemplateFields(userModule.setting_fields);
	}

	return [];
};

export const getFieldOption = (
	userModule: Module,
	key: string
): FilterFieldOption | undefined => {
	if (key === SEARCH_FILTER_KEY) {
		return getFilterFieldOptions(userModule).find(
			(option) => option.type === "search"
		);
	}

	return getFilterFieldOptions(userModule).find(
		(option) => option.value === key
	);
};

export const getFieldType = (
	userModule: Module,
	key: string
): FilterFieldType | undefined => {
	if (key === SEARCH_FILTER_KEY) {
		return "search";
	}

	return getFieldOption(userModule, key)?.type;
};

export const getSearchFilterInputType = (
	type?: Field["type"]
): "select" | "input" | "toggle" => {
	if (type === "toggle" || type === "select_toggle" || type === "checkbox") {
		return "toggle";
	}
	if (type === "select") {
		return "select";
	}
	return "input";
};

export const encodeSearchValue = (path: string, value: unknown): string => {
	if (value === "" || value === null || value === undefined) {
		return "";
	}
	return `${path}:${value}`;
};

export const decodeSearchValue = (path: string, value: unknown): string => {
	if (typeof value !== "string") {
		return value == null ? "" : String(value);
	}
	if (path && value.startsWith(`${path}:`)) {
		return value.slice(path.length + 1);
	}
	return value;
};
