import { FormikValues } from "formik";
import { isEqual } from "lodash";
import { FormDataElement } from "../types";

const getChangedValues = (
	currentValues: FormikValues,
	initialValues: FormDataElement | undefined
) => {
	const changes: FormikValues = {};
	if (!initialValues) {
		return currentValues;
	}
	Object.keys(currentValues).forEach((key) => {
		// Check if the value has changed
		if (!isEqual(currentValues[key], initialValues[key])) {
			changes[key] = currentValues[key];
		}
	});

	return Object.keys(changes).length ? changes : null;
};

export default getChangedValues;
