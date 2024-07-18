import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import useFormikStore from '../context/useFormikStore';

const FormSubmitStore = () => {
	const { submitForm, values, initialValues, isValid: formIsValid } = useFormikContext();
	// const {setFormSubmitHandler, dataHasChanged, setDataHasChanged, setIsValid, isValid} = useFormikStore();
	// validateForm();
	useEffect(() => {
		console.log(values);
		
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