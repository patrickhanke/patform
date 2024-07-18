const getSelectValue = (values, field) => {

	if (typeof values[field.name] === 'string') {
		return field.options.find(option => option.value === values[field.name]) || field.options.find(option => option.label === values[field.name]);
	}
	if (typeof values[field.name] === 'object') {
		return values[field.name];
	}
	return undefined;
};

export default getSelectValue;
