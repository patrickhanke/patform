import { FieldValidationArray, getFieldsWithValidationFunction } from '../types';

const getFieldsWithValidation: getFieldsWithValidationFunction = (fields) => {
	const fieldArray: FieldValidationArray = [];
	fields.forEach(field => {
		if (field.validation) {
			fieldArray.push(field as FieldValidationArray[number]);
        
		}
	});

	return fieldArray;
};

export default getFieldsWithValidation;