import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { FormSubmitStoreProps } from '../types';

const FormSubmitStore = ({formValidationHandler}: FormSubmitStoreProps) => {
	const { submitForm, values, initialValues, isValid: formIsValid } = useFormikContext();
	useEffect(() => {
		const dataHasChanged = !isEqual(values, initialValues);
		if (formValidationHandler) {
			formValidationHandler(formIsValid);
		}
		if (dataHasChanged) {
			submitForm();
		}
		// setDataHasChanged(dataHasChanged);
		// setIsValid(formIsValid);
		// setFormSubmitHandler(submitForm);
	}, [values, initialValues, formIsValid, submitForm]);

	return null;
};

export default FormSubmitStore;