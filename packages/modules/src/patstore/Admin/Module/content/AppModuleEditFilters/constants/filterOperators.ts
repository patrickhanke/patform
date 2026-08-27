const filterOperators = (fieldType: string) => {
	switch (fieldType) {
		case "string":
			return [
				{ value: "matchesRegex", label: "matchesRegex" },
				{ value: "equalTo", label: "equalTo" },
				{ value: "in", label: "in" },
				{ value: "exists", label: "exists" }
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
		case "pointer":
			return [{ value: "have", label: "have" }];
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
		case "search": {
			return [{ value: "equalTo", label: "equalTo" }];
		}
		default: {
			return [];
		}
	}
};

export default filterOperators;
