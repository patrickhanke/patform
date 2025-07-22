import * as Yup from "yup";
import { FormikHandlers, FormikValues } from "formik";
import { Dispatch, SetStateAction } from "react";
import { Pointer } from "@repo/types";
import { DatePickerTypes } from "@repo/ui";

export type handleFormData<V extends FormDataElement> = (data: V) => void;

export type FormikRenderProps = {
	fields: Field[];
	data?: FormDataElement;
	formSubmitHandler?: (values: FormikValues) => void;
	formValidationHandler?: (t: boolean) => void;
	useWithDebounce?: boolean;
	enableReinitialize?: boolean;
	apiClass?: string;
	id?: string;
	isHorizontal?: boolean;
	setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>;
	highlightChanges?: boolean;
};

export type FormSubmitStoreProps = {
	formValidationHandler?: (t: boolean) => void;
	useWithDebounce?: boolean;
	submitForm: FormikHandlers["handleSubmit"];
};

export type FieldTypes =
	| "input"
	| "url"
	| "number"
	| "password"
	| "textarea"
	| "select"
	| "image"
	| "file"
	| "color"
	| "toggle"
	| "texteditor"
	| "pointer_select"
	| "persons_select";

export type ValidationTypes = {
	required?: string;
	min_length?: number;
	max_length?: number;
	min_value?: number;
	max_value?: number;
	email?: boolean;
	url?: boolean;
	number?: boolean;
	password?: boolean;
};

export type BasicField = {
	id: string;
	name: string;
	label: string;
	position?: number;
	placeholder?: string;
	initialValue?: any;
	options?: object;
	disabled?: (values: FormikValues) => boolean | boolean;
	width?: string | number;
	validation?: {
		validate?: boolean;
		required?: string;
	};
};

export type FieldType = {
	id: string;
	name: string;
	type: FieldTypes;
	label: string;
	position?: number;
	placeholder?: string;
	initialValue?: any;
	validation?: ValidationTypes;
	dataType?: "string" | "object" | "array";
	path?: string;
	options?: {
		number_start_value?: number;
		number_end_value?: number;
		return_type?: "array" | "string";
		max_file_count?: number;
		pointer_type?: string;
	};
	select_options?: {
		label: string;
		value: string;
	}[];
};

export type StringField = BasicField & {
	type: "input" | "url" | "password" | "textarea" | "texteditor";
	dataType?: "string";
	value?: string;
	textAlign?: "left" | "center" | "right";
	validation?: {
		validate?: boolean;
		required?: string;
		min_length?: number;
		max_length?: number;
		email?: boolean;
		url?: boolean;
		number?: boolean;
		password?: boolean;
	};
};

export type ToggleField = BasicField & {
	type: "toggle" | "select_toggle";
	value?: boolean;
	validation?: {
		required?: string;
	};
};

export type NumberField = BasicField & {
	value?: number;
	type?: "number";
	dataType?: "number";
	textAlign?: "left" | "center" | "right";
	options: {
		number_start_value: number;
		number_end_value: number;
	};
	validation?: {
		required?: string;
		min_value?: number;
		max_value?: number;
		number?: boolean;
	};
};

export type ImageField = BasicField & {
	type: "image";
	value?: string;
	options: {
		return_type: "array" | "string";
		max_file_count: number;
	};
	validation?: {
		validate?: boolean;
		required?: string;
		max_file_count?: number;
	};
};

export type FileField = BasicField & {
	type: "file";
	value?: string | string[];
	validation?: {
		validate?: boolean;
		required?: string;
		max_file_count?: number;
	};
};

export type SelectField = BasicField & {
	type: "select";
	value?: string | object;
	dataType: "string" | "object";
	select_options: { label: string; value: string }[];
};

export type PointerSelectField = BasicField & {
	type: "pointer_select";
	value?: Pointer<any>;
	select_options: { label: string; value: string }[];
	options: {
		pointer_class: string;
	};
};

export type PersonsSelectField = BasicField & {
	value?: object;
	type: "persons_select";
};

export type ColorField = BasicField & {
	type: "color";
	value?: string;
	validation?: {
		validate?: boolean;
		required?: string;
	};
};

export type DateField = BasicField & {
	type: DatePickerTypes;
	value?: string;
	validation?: {
		validate?: boolean;
		required?: string;
	};
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
	| DateField;

export type FieldValidationArray = Array<
	Field & { validation?: ValidationTypes }
>;

export type getFieldsWithValidationFunction = (
	fields: Field[]
) => FieldValidationArray;

export type CreateYupSchemaFunction = (
	type: Field["type"],
	validation?: Field["validation"]
) => Yup.ISchema<any, any, any, any> | Yup.Reference<unknown>;

export type FormDataElement = { [key: string]: any };
