import { fieldType, formField, formFieldArray } from '@/types';
import { FieldsTypes } from '@/types/_UI';
import { log } from 'console';

const operatorHandler = (operator, value1, value2) => {
	if (operator === '===') {
		return value1 === value2;
	}
	if (operator === '!==') {
		return value1 !== value2;
	}
	if (operator === '>') {
		return value1 > value2;
	}
	if (operator === '<') {
		return value1 < value2;
	}
	if (operator === '>=') {
		return value1 >= value2;
	}
	if (operator === '<=') {
		return value1 <= value2;
	}

	return false;
};

const fieldConditionHandler = (field: FieldsTypes.Field<'field'>, fields: FieldsTypes.Field<'field'>[]) : boolean => {
	if (!field.condition) {
		return true;
	}

	if (field.condition){
		if (field.condition === 'cross_reference') {
			const question =  field.condition_options?.question;
			const attribute =  field.condition_options?.attribute;
			const operator =  field.condition_options?.operator;
			const value =  field.condition_options?.value;

			if (question && attribute && operator && value) {
				const referenceField = fields.find(refField => refField.objectId === field.condition_options?.question);
				if (referenceField) {
					if (attribute === 'value') {
						return operatorHandler(operator, value, referenceField.value);
					}
					return true;
				}
				return true;
			}
			return true;
		}
		return true;
	}
	return true;
};

export default fieldConditionHandler;
