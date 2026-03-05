import { TransformOperatorValueToObject } from "../types";

const transformOperatorValueToObject: TransformOperatorValueToObject = ({
	type,
	operator,
	value
}) => {
	if (type === "string") {
		return value;
	}
	if (type === "id" || type === "ids") {
		return value;
	}
	if (type === "pointer") {
		return value;
	}
	if (type === "search") {
		return value;
	}
};

export default transformOperatorValueToObject;
