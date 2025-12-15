import {
	CreateYupSchemaFunction,
	StringValidation,
	NumberValidation,
	FileValidation
} from "../types";
import * as Yup from "yup";

// Type guards
const isStringValidation = (
	validation: unknown
): validation is StringValidation => {
	return (
		!!validation &&
		typeof validation === "object" &&
		("min_length" in validation ||
			"max_length" in validation ||
			"email" in validation ||
			"matches" in validation)
	);
};

const isNumberValidation = (
	validation: unknown
): validation is NumberValidation => {
	return (
		!!validation &&
		typeof validation === "object" &&
		("min_value" in validation || "max_value" in validation)
	);
};

const isFileValidation = (
	validation: unknown
): validation is FileValidation => {
	return (
		!!validation &&
		typeof validation === "object" &&
		"max_file_count" in validation
	);
};

const createYupSchema: CreateYupSchemaFunction = (type, validation) => {
	let method:
		| Yup.StringSchema
		| Yup.NumberSchema
		| Yup.ArraySchema<
				string[] | undefined,
				undefined,
				Yup.AnyObject | undefined
		  > = Yup.string();
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
			// Check if validation is StringValidation before accessing string-specific properties
			if (isStringValidation(validation)) {
				if (validation.min_length) {
					method = method.min(
						validation.min_length,
						`Die Mindestlänge beträgt ${validation.min_length}`
					);
				}
				if (validation.max_length) {
					method = method.max(
						validation.max_length,
						`Die Höchstlänge beträgt ${validation.max_length}`
					);
				}
			}
		}

		if (type === "number") {
			method = Yup.number();
			if (validation?.required) {
				method = method.required(validation.required);
			}
			// Check if validation is NumberValidation before accessing number-specific properties
			if (isNumberValidation(validation)) {
				if (validation.min_value) {
					method = method.min(
						validation.min_value,
						`Der Mindestwert beträgt ${validation.min_value}`
					);
				}
				if (validation.max_value) {
					method = method.max(
						validation.max_value,
						`Der Höchstwert beträgt ${validation.max_value}`
					);
				}
			}
		}

		if (type === "persons_select") {
			method = Yup.array();
			if (validation?.required) {
				method = method.required(validation.required);
			}
		}

		if (type === "select") {
			method = Yup.string();
			if (validation?.required) {
				method = method.required(validation.required);
			}
		}

		if (type === "password") {
			method = Yup.string();
			if (validation?.required) {
				method = method.required(validation.required);
			}
		}

		// Add additional dynamic properties based on the validation object
		if (type === "input" && isStringValidation(validation)) {
			if (validation.email) {
				method = (method as Yup.StringSchema).email(
					"Bitte geben Sie eine gültige E-Mail-Adresse ein"
				);
			}
			if (validation.matches) {
				method = (method as Yup.StringSchema).matches(
					new RegExp(validation.matches.pattern),
					validation.matches.message || "Das Format ist ungültig"
				);
			}
		}
	}
	return method;
};

export default createYupSchema;
