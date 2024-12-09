import { FieldsTypes } from '@/types/_UI';

const getConditionalField = (fields: FieldsTypes.Field<'field'>[], conditionalFields: Array<FieldsTypes.ConditionalField>) => {
	const fieldsValue:  FieldsTypes.Field<'field'>[] = [] ;
	conditionalFields.forEach(conField => {
		const fieldIndex = fields.findIndex(field =>  field.name === conField.cond_field && field.value === conField.cond_type );
		if (fieldIndex !== -1) {
			fieldsValue.push(...conField.fields);
		}
	});
	
	return fieldsValue;
};

export default getConditionalField;