import { Filter } from "@repo/types";
import { ParamsHandlerType } from "../types";

type ConstraintNode = {
	[key: string]: string | number | boolean | object | null;
};

type FilterCondition = {
	[key: string]: ConstraintNode[string];
};

type FilterObject = {
	[key: string]: FilterCondition | FilterCondition[];
};

const TEMPLATE_SEGMENTS = new Set([
	"equalTo",
	"notEqualTo",
	"lessThan",
	"lessThanOrEqualTo",
	"greaterThan",
	"greaterThanOrEqualTo",
	"in",
	"notIn",
	"matchesRegex",
	"exists",
	"containedIn",
	"have",
	"haveNot",
	"contains",
	"value"
]);

const isNestedOperatorTemplate = (template: string) => {
	const trimmed = template.trim();
	if (trimmed.includes("{{value}}") || trimmed.startsWith("{")) {
		return true;
	}

	return trimmed
		.split(".")
		.some((segment) => TEMPLATE_SEGMENTS.has(segment));
};

const setAtPath = (path: string[], value: Filter["value"]): ConstraintNode => {
	const root: ConstraintNode = {};
	let cursor: ConstraintNode = root;

	path.forEach((segment, index) => {
		if (index === path.length - 1) {
			cursor[segment] = value as ConstraintNode[string];
			return;
		}

		const next: ConstraintNode = {};
		cursor[segment] = next;
		cursor = next;
	});

	return root;
};

const parseJsonTemplate = (
	template: string,
	value: Filter["value"]
): ConstraintNode | undefined => {
	const encoded = JSON.stringify(value);
	let source = template
		.replaceAll('"{{value}}"', encoded)
		.replaceAll("{{value}}", encoded);

	try {
		return JSON.parse(source) as ConstraintNode;
	} catch {
		source = source.replace(
			/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g,
			'$1"$2":'
		);
	}

	try {
		return JSON.parse(source) as ConstraintNode;
	} catch (error) {
		console.error("paramsHandler: invalid operatorTemplate", template, error);
		return undefined;
	}
};

// Nested constraint replaces `operator`. Dot path (`have.objectId.equalTo`
// or `have.objectId.equalTo.value`) or JSON with a {{value}} placeholder.
// A plain search path (no constraint segment) is not a template.
const constraintFromOperatorTemplate = (
	template: string,
	value: Filter["value"]
): ConstraintNode | undefined => {
	const trimmed = template.trim();
	if (!trimmed || !isNestedOperatorTemplate(trimmed)) {
		return undefined;
	}

	if (trimmed.includes("{{value}}") || trimmed.startsWith("{")) {
		return parseJsonTemplate(trimmed, value);
	}

	const segments = trimmed.split(".").filter(Boolean);
	const path =
		segments[segments.length - 1] === "value"
			? segments.slice(0, -1)
			: segments;

	if (path.length === 0) {
		return undefined;
	}

	return setAtPath(path, value);
};

const paramsHandler: ParamsHandlerType = ({
	language,
	projectId,
	moduleId,
	filters,
	userId,
	propertyId,
	userIds,
	absenceId
}) => {
	const filterObject: FilterObject = {};

	if (language) {
		filterObject.OR = [
			{ lang: { equalTo: language } },
			{ lang: { exists: false } }
		];
	}

	if (propertyId) {
		filterObject.property = {
			have: { objectId: { equalTo: propertyId } }
		};
	}

	if (projectId) {
		filterObject.project = { have: { id: { equalTo: projectId } } };
	}

	if (moduleId) {
		filterObject.module = { have: { id: { equalTo: moduleId } } };
	}

	if (userId) {
		filterObject.user = { have: { objectId: { equalTo: userId } } };
	}

	if (userIds) {
		filterObject.user = { have: { objectId: { in: userIds } } };
	}

	if (absenceId) {
		filterObject.absence = { have: { objectId: { equalTo: absenceId } } };
	}

	let additionalFilters: FilterObject = {};

	if (filters && filters?.length > 0) {
		additionalFilters = filters?.reduce(
			(
				acc: Record<
					string,
					{ [key: string]: string | number | boolean | object | null }
				>,
				filter: Filter
			) => {
				if (!filter.value) {
					return acc;
				}

				if (
					filter.operatorTemplate &&
					isNestedOperatorTemplate(filter.operatorTemplate)
				) {
					const constraint = constraintFromOperatorTemplate(
						filter.operatorTemplate,
						filter.value
					);
					if (constraint) {
						acc[filter.key] = constraint;
					}
					return acc;
				}

				if (filter.operator === "matchesRegex") {
					acc[filter.key] = {
						[filter.operator]: filter.value,
						options: "i"
					};
				} else {
					acc[filter.key] = {
						[filter.operator]: filter.value as
							| string
							| number
							| boolean
							| object
							| null
					};
				}

				return acc;
			},
			{}
		);
	}
	return { ...filterObject, ...additionalFilters };
};

export default paramsHandler;
