
const getPointerValue = (
	value: {__type: 'Pointer', className: string, objectId: string} | undefined, 
	options: {value: string, label: string}[]
) => {
	let returnValue = undefined;
	if (value?.objectId) {
		returnValue =  options.find(option => option.value === value.objectId); 
	}

	return returnValue;
};

export default getPointerValue;