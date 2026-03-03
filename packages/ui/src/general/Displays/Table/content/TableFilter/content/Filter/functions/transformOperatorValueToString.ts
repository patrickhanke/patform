import { TransformOperatorValueToObject } from "../types";

const transformOperatorValueToObject: TransformOperatorValueToObject = ({
	type,
	operator,
	value
}) => {
	if (type === "string") {
		return value;
	}
};

export default transformOperatorValueToObject;
