import { useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";
import { SlideInFormSubmitStoreProps } from "../types";
import FormActionBar from "./FormActionBar";

const SlideInFormSubmitStore = ({
	formValidationHandler,
	setErrors
}: SlideInFormSubmitStoreProps) => {
	const [open, setOpen] = useState(false);

	const {
		submitForm,
		values,
		initialValues,
		isValid: formIsValid,
		errors,
		setValues
	} = useFormikContext();
	// const [formValues, setFormValues] = useDebounceValue(initialValues, 2000);

	useEffect(() => {
		const dataHasChanged = !isEqual(values, initialValues);
		if (formValidationHandler) {
			formValidationHandler(formIsValid);
		}
		if (setErrors) {
			setErrors(errors);
		}
		if (dataHasChanged) {
			setValues(values);
		}

		// setDataHasChanged(dataHasChanged);
		// setIsValid(formIsValid);
		// setFormSubmitHandler(submitForm);
	}, [values, initialValues, formIsValid, errors]);

	return (
		<FormActionBar
			open={open}
			setOpen={setOpen}
			handleSubmit={submitForm}
		/>
	);
};

export default SlideInFormSubmitStore;
