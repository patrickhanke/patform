const filterOperators = [
	{ value: "template", label: "Template" },
	{ value: "equalTo", label: "equalTo" },
	{ value: "notEqualTo", label: "notEqualTo" },
	{ value: "in", label: "in" },
	{ value: "notIn", label: "notIn" },
	{ value: "contains", label: "contains" },
	{ value: "containedIn", label: "containedIn" },
	{ value: "containedBy", label: "containedBy" },
	{ value: "matchesRegex", label: "matchesRegex" },
	{ value: "exists", label: "exists" },
	{ value: "have", label: "have (Pointer)" },
	{ value: "haveNot", label: "haveNot (Pointer)" },
	{ value: "lessThan", label: "lessThan" },
	{ value: "lessThanOrEqualTo", label: "lessThanOrEqualTo" },
	{ value: "greaterThan", label: "greaterThan" },
	{ value: "greaterThanOrEqualTo", label: "greaterThanOrEqualTo" }
] as const;

export default filterOperators;
