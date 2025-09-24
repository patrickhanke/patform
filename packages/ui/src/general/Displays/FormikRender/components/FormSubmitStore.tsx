import { useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";
import { FormSubmitStoreProps } from "../types";
import { useDebounceValue } from "usehooks-ts";
import FormActionBar from "./FormActionBar";

const FormSubmitStore = ({
	formValidationHandler,
	useWithDebounce = false
}: FormSubmitStoreProps) => {
	const [open, setOpen] = useState(false);

	const {
		submitForm,
		values,
		initialValues,
		isValid: formIsValid
	} = useFormikContext();
	const [formValues, setFormValues] = useDebounceValue(initialValues, 2000);

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

		// setDataHasChanged(dataHasChanged);
		// setIsValid(formIsValid);
		// setFormSubmitHandler(submitForm);
	}, [values, initialValues, formIsValid, submitForm]);

	useEffect(() => {
		if (useWithDebounce) {
			const dataHasChanged = !isEqual(initialValues, formValues);
			if (dataHasChanged) {
				setOpen(true);
			}
		}
	}, [formValues]);

	return (
		<FormActionBar
			open={open}
			setOpen={setOpen}
			handleSubmit={submitForm}
		/>
	);
};

export default FormSubmitStore;
