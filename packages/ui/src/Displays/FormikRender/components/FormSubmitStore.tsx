import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { FormSubmitStoreProps } from '../types';
import { useDebounceValue } from 'usehooks-ts';

const FormSubmitStore = ({formValidationHandler, useWithDebounce = false}: FormSubmitStoreProps) => {
	const { submitForm, values, initialValues, isValid: formIsValid } = useFormikContext();
	const [formValues, setFormValues] = useDebounceValue(initialValues, 2000);
	
	console.log(formValues);
	console.log(initialValues);
		
	
	useEffect(() => {
		const dataHasChanged = !isEqual(values, initialValues);
		console.log(dataHasChanged);
		console.log(useWithDebounce);
		
		if (formValidationHandler) {
			formValidationHandler(formIsValid);
		}
		if (dataHasChanged && !useWithDebounce) {
			submitForm();
		}
		if (dataHasChanged && useWithDebounce) {
			setFormValues(values);
		}

		// setDataHasChanged(dataHasChanged);
		// setIsValid(formIsValid);
		// setFormSubmitHandler(submitForm);
	}, [values, initialValues, formIsValid, submitForm]);

	useEffect(() => {
		console.log({formValues});
		if (useWithDebounce) {
			const dataHasChanged = !isEqual(initialValues, formValues);
			console.log({dataHasChanged});
			
			if (dataHasChanged) {
				submitForm();
			}
		}
	}, [formValues]);

	return null;
};

export default FormSubmitStore;