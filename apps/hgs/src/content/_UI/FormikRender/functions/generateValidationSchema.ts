import { fieldType, fieldsType, formFieldType } from '@/types';
import * as Yup from 'yup';

const getFieldValidation = (field: formFieldType<fieldType>) => {
	if (field.type === 'number') {
		return Yup.number()
			.required('Pflichtfeld')
			.min(field?.options?.number_start_value || 0, `Der Wert darf nicht unter ${field?.options?.number_start_value || 100} liegen.`)
			.max(field?.options?.number_end_value || 100, `Der Wert darf nicht über ${field?.options?.number_end_value || 100} liegen.`);
	}
	if (field.type === 'select') {
		if (field.dataType === 'string') {
			return Yup.string().required('Pflichtfeld');
		}
		if (field.dataType === 'object') {
			return Yup.object().required('Pflichtfeld');
		}
	}
	if (field.type === 'textarea' || field.type === 'input' ) {
		return Yup.string()
			.required('Pflichtfeld');
	}
	return undefined;

};


const generateValidationSchema = (fields: fieldsType, usePages: boolean) => {
	let validationsObject = {};
	
	if (usePages === true) {

		fields.forEach(field => {
			field.questions.forEach(question => {
				if (question.validation === true) {
				
					validationsObject = {
						...validationsObject,
						[question.name]: getFieldValidation(question)
					};
				}
			});
		});
	}

	if (usePages === false) {
		fields.forEach(field => {
			
			if (field.validation === true) {
				
				validationsObject = {
					...validationsObject,
					[field.name]: getFieldValidation(field)
				};
			}
		});

	}

	return Yup.object().shape(validationsObject);
};

export default generateValidationSchema;