import { useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";
import { FormSubmitStoreProps } from "../types";
import { useDebounceValue } from "usehooks-ts";
import FormActionBar from "./FormActionBar";
import { IconButton } from "@repo/ui";

const FormSubmitStore = ({
	formValidationHandler,
	useWithDebounce = false,
	noSubmit = false,
	setErrors,
	submitButton = false
}: FormSubmitStoreProps) => {
	const [open, setOpen] = useState(false);

	const {
		submitForm,
		values,
		initialValues,
		isValid: formIsValid,
		errors,
		resetForm
	} = useFormikContext();
	const [formValues, setFormValues] = useDebounceValue(initialValues, 1000);
	useEffect(() => {
		const dataHasChanged = !isEqual(values, initialValues);
		if (formValidationHandler) {
			formValidationHandler(formIsValid);
		}
		if (dataHasChanged && !useWithDebounce) {
			setOpen(true);
		}
		if (dataHasChanged && useWithDebounce) {
			setFormValues(values);
		}
		if (setErrors) {
			setErrors(errors);
		}
	}, [values, initialValues, formIsValid, errors]);

	useEffect(() => {
		if (useWithDebounce) {
			const dataHasChanged = !isEqual(initialValues, formValues);
			if (dataHasChanged) {
				if (noSubmit === false) {
					submitForm();
				}
			}
		} else if (!useWithDebounce) {
			const dataHasChanged = !isEqual(initialValues, formValues);
			if (dataHasChanged) {
				setOpen(true);
			}
		}
	}, [formValues]);

	return submitButton ? (
		<IconButton
			text="Speichern"
			disabled={!formIsValid || !isEqual(initialValues, formValues)}
			type="submit"
		/>
	) : (
		<FormActionBar
			open={open}
			setOpen={setOpen}
			handleSubmit={submitForm}
			resetForm={resetForm}
		/>
	);
};

export default FormSubmitStore;
