import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import { useEffect } from 'react';

const FormSubmitStore = () => {
	const { submitForm, values, initialValues, isValid: formIsValid } = useFormikContext();
	useEffect(() => {
		const dataHasChanged = !isEqual(values, initialValues);
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