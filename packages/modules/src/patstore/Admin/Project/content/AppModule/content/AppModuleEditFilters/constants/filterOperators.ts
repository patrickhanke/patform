const filterOperators = (fieldType: string) => {
	switch (fieldType) {
		case "string":
			return [
				{ value: "matchesRegex", label: "matchesRegex" },
				{ value: "equalTo", label: "equalTo" },
				{ value: "in", label: "in" }
			];
		case "number":
			return [
				{ value: "equalTo", label: "equalTo" },
				{ value: "notEqualTo", label: "notEqualTo" },
				{ value: "lessThan", label: "lessThan" },
				{ value: "lessThanOrEqualTo", label: "lessThanOrEqualTo" },
				{ value: "greaterThan", label: "greaterThan" },
				{ value: "greaterThanOrEqualTo", label: "greaterThanOrEqualTo" }
			];
		case "id": {
			return [
				{ value: "equalTo", label: "equalTo" },
				{ value: "in", label: "in" }
			];
		}
		case "ids": {
			return [{ value: "in", label: "in" }];
		}
		case "boolean": {
			return [{ value: "equalTo", label: "equalTo" }];
		}
		case "object": {
			return [{ value: "search", label: "search" }];
		}
		case "array": {
			return [{ value: "search", label: "search" }];
		}
		default: {
			return [];
		}
	}
};

export default filterOperators;
