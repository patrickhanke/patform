const getSelectValue = (values, field) => {
	if (field.dataType === 'string' ) {
		return field?.select_options?.find(option => option.id === values) || field.select_options.find(option => option.value === values);
	}
	if (field.dataType === 'object' || field.dataType === 'array') {
		return values;
	}
	if (field.dataType === 'pointer' ) {
		return field?.select_options?.find(option => option.id === values?.objectId) || field.select_options.find(option => option.label === values?.name);
	}
	return undefined;
};

export default getSelectValue;
