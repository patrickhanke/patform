import * as Yup from "yup";
import {
	FormikErrors,
	FormikHandlers,
	FormikHelpers,
	FormikValues
} from "formik";
import { Dispatch, SetStateAction } from "react";
import { Pointer } from "@repo/types";
import { DatePickerTypes } from "@repo/ui";
import ParseFile from "parse/types/ParseFile";

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
	showRequired?: boolean;
};

export type FormikRenderSlideInProps = {
	title: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	dataHandler: (values: FormikValues) => void | Promise<void>;

	fields: Field[];
	data?: FormDataElement;
	apiClass?: string;
	id?: string;
	isHorizontal?: boolean;
	highlightChanges?: boolean;
};

export type FormSubmitStoreProps = {
	formValidationHandler?: (t: boolean) => void;
	useWithDebounce?: boolean;
	noSubmit?: boolean;
	setErrors?: (errors: FormikErrors<FormikValues>) => void;
};

export type SlideInFormSubmitStoreProps = {
	formValidationHandler?: (t: boolean) => void;
	useWithDebounce?: boolean;
	noSubmit?: boolean;
	setErrors?: (errors: FormikErrors<FormikValues>) => void;
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
	| "persons_select"
	| "downloads"
	| "download"
	| "image_select"
	| "image_upload";

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
	label: string;
	position?: number;
	placeholder?: string;
	initialValue?: any;
	options?: object;
	disabled?: (values: FormikValues) => boolean | boolean;
	width?: string | number;
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
	validation?: StringValidation;
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
	validation?: BaseValidation;
};

export type PointerSelectField = BasicField & {
	type: "pointer_select";
	value?: Pointer<any>;
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
	| ImageUploadField;

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

export type FormActionBarProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleSubmit: FormikHandlers["handleSubmit"];
	resetForm: FormikHelpers<FormikValues>["resetForm"];
};
