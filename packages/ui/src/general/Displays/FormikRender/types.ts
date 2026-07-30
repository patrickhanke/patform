import * as Yup from "yup";
import {
	FormikErrors,
	FormikHandlers,
	FormikHelpers,
	FormikValues
} from "formik";
import { Dispatch, SetStateAction } from "react";
import { Field, ValidationTypes } from "@repo/types";

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
	confirmButtonText?: string;
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
