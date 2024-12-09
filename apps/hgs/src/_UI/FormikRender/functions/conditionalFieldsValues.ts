import { get, set } from 'lodash';
import { conditionalFieldsType } from '@/types';

const conditionalFieldsValues = (conditionalFieldsArray: Array<conditionalFieldsType>, data: any) => {
	const conditionalFieldsArrayCopy = conditionalFieldsArray.slice(); 

	const defaultValues = (dataType: string) => {
		if (dataType === 'array') {
			return [];
		}
		if (dataType === 'object') {
			return {};
		}
		if (dataType === 'string') {
			return '';
		}
		if (dataType === 'number') {
			return null;
		}
		return undefined;
	};
    
	conditionalFieldsArray.forEach((cf, cfIndex) => {
		cf.fields.forEach((field, fieldIndex) => {
			const fieldData = get(data, field.name, defaultValues(field.dataType));
			set(conditionalFieldsArrayCopy, `[${cfIndex}].fields[${fieldIndex}].value`, fieldData  );
			
		});
	});

	return conditionalFieldsArrayCopy;
};

export default conditionalFieldsValues;