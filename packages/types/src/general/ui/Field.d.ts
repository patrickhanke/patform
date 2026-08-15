import { FormikValues } from "formik";
import React from "react";
import ParseFile from "parse/types/ParseFile";

// import { DatePickerTypes } from "@repo/ui";
import { Pointer } from "../Application";
import { DatePickerTypes } from "./DatePicker";

// Base validation properties common to all fields
export type BaseValidation = {
	validate?: boolean;
	required?: string;
};

// String field validation (input, url, password, textarea, texteditor)
export type StringValidation = BaseValidation & {
	min_length?: number;
	max_length?: number;
	email?: boolean;
	url?: boolean;
	matches?: {
		pattern: string;
		message?: string;
	};
	ref?: {
		value: string;
		message?: string;
	};
};

// Number field validation
export type NumberValidation = BaseValidation & {
	min_value?: number;
	max_value?: number;
};

// File/Image field validation
export type FileValidation = BaseValidation & {
	max_file_count?: number;
};

// Union of all validation types (for generic use)
export type ValidationTypes =
	| StringValidation
	| NumberValidation
	| FileValidation
	| BaseValidation;

export type BasicField = {
	id: string;
	name: string;
	label: string | React.ReactNode;
	description?: string;
	position?: number;
	placeholder?: string;
	initialValue?: "string" | "number" | "boolean" | "object" | "array";
	options?: object;
	disabled?: boolean | ((values: FormikValues) => boolean);
	width?: string | number;
};

export type StringField = BasicField & {
	type:
		| "input"
		| "url"
		| "password"
		| "textarea"
		| "texteditor"
		| "password_confirmation";
	dataType?: "string";
	value?: string;
	textAlign?: "left" | "center" | "right";
	validation?: StringValidation;
};

export type CheckboxField = BasicField & {
	type: "checkbox";
	value?: boolean;
	validation?: BaseValidation;
};

export type ToggleField = BasicField & {
	type: "toggle" | "select_toggle";
	value?: boolean;
	validation?: BaseValidation;
};

export type NumberField = BasicField & {
	value?: number;
	type: "number";
	dataType?: "number";
	textAlign?: "left" | "center" | "right";
	options: {
		number_start_value: number;
		number_end_value: number;
	};
	validation?: NumberValidation;
};

export type ImageField = BasicField & {
	type: "image";
	value?: string;
	options: {
		return_type: "array" | "string";
		max_file_count: number;
	};
	validation?: FileValidation;
};

export type ImageSelectField = BasicField & {
	type: "image_select";
	value?: string;
	options: {
		return_type: "array" | "string";
		max_file_count: number;
	};
	validation?: FileValidation;
};

export type ImageUploadField = BasicField & {
	type: "image_upload";
	value?: ParseFile;
	validation?: FileValidation;
};

export type FileField = BasicField & {
	type: "file";
	value?: string | string[];
	validation?: FileValidation;
};

export type SelectField = BasicField & {
	type: "select";
	value?: string | object;
	dataType: "string" | "object";
	select_options: { label: string; value: string }[];
	isMulti?: boolean;
	validation?: BaseValidation;
};

export type PointerSelectField = BasicField & {
	type: "pointer_select";
	value?: Pointer<unknown>;
	select_options: { label: string; value: string }[];
	options: {
		pointer_class: string;
	};
	validation?: BaseValidation;
};

export type PersonsSelectField = BasicField & {
	value?: object;
	type: "persons_select";
	validation?: BaseValidation;
};

export type DownloadField = BasicField & {
	value?: string;
	type: "download";
	validation?: BaseValidation;
};

export type DownloadsField = BasicField & {
	value?: string[];
	type: "downloads";
	validation?: BaseValidation;
};

export type ColorField = BasicField & {
	type: "color";
	value?: string;
	validation?: BaseValidation;
};

export type DateField = BasicField & {
	type: DatePickerTypes;
	value?: string;
	validation?: BaseValidation;
};

export type Field =
	| StringField
	| ToggleField
	| NumberField
	| ImageField
	| FileField
	| SelectField
	| PointerSelectField
	| ColorField
	| PersonsSelectField
	| DateField
	| DownloadField
	| DownloadsField
	// | FileUploadField
	| ImageSelectField
	| ImageUploadField
	| CheckboxField;
