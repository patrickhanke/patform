import { CreateYupSchemaFunction } from "../types";
import * as Yup from "yup";

const createYupSchema: CreateYupSchemaFunction = (type, validation) => {
	let method:
		| Yup.StringSchema
		| Yup.NumberSchema
		| Yup.ArraySchema<any[], Yup.AnyObject, undefined, ""> = Yup.string();
	if (validation?.validate === true) {
		if (
			type === "input" ||
			type === "url" ||
			type === "textarea" ||
			type === "date" ||
			type === "image" ||
			type === "texteditor" ||
			type === "datetime" ||
			type === "datetime-local"
		) {
			method = Yup.string();
			if (validation?.required) {
				method = method.required(validation.required);
			}
			if (validation?.min_length) {
				method = method.min(
					validation.min_length,
					`Die Mindestlänge beträgt ${validation.min_length}`
				);
			}
			if (validation?.max_length) {
				method = method.max(
					validation.max_length,
					`Die Höchstlänge beträgt ${validation.max_length}`
				);
			}
		}

		if (type === "number") {
			method = Yup.number();
			if (validation?.required) {
				method = method.required(validation.required);
			}
			if (validation?.min_value) {
				method = method.min(
					validation.min_value,
					`Der Mindestwert beträgt ${validation.min_value}`
				);
			}
			if (validation?.max_value) {
				method = method.max(
					validation.max_value,
					`Der Höchstwert beträgt ${validation.max_value}`
				);
			}
		}

		if (type === "persons_select") {
			method = Yup.array();
			if (validation?.required) {
				method = method.required(validation.required);
			}
		}

		// Add additional dynamic properties based on the validation object
		if (validation?.email && type === "input") {
			method = (method as Yup.StringSchema).email(
				"Bitte geben Sie eine gültige E-Mail-Adresse ein"
			);
		}
		if (validation?.matches && type === "input") {
			method = (method as Yup.StringSchema).matches(
				new RegExp(validation.matches.pattern),
				validation.matches.message || "Das Format ist ungültig"
			);
		}
	}
	return method;
};

export default createYupSchema;
