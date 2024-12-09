import { fieldsType } from '@/types';

const getUpdateDataFromValues = ({values, fields}: {values: object, fields: fieldsType}) => {
	let updateObject = {};
	Object.keys(values).forEach(value => {
		const field = fields.find(field => field.name === value);
		if (field?.updateString && values[value as keyof object]) {
			updateObject = {
				...updateObject,
				[value]: field?.updateString(values[value as keyof object])
			};
		} else {
			updateObject={
				...updateObject,
				[value]: values[value as keyof object]
			};
		}
	});

	return updateObject;
};

export default getUpdateDataFromValues;